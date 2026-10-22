"""Behavioral tests for reused validation, scaffolding, and progress commands."""

from collections import Counter
import json
from pathlib import Path
import subprocess
import sys
import tempfile
import unittest

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from content_data import question_fingerprint
from generate_progress import collect, render
from scaffold_topic import scaffold
from validate_content import validate


class ContentToolsTests(unittest.TestCase):
    def setUp(self):
        self.temporary = tempfile.TemporaryDirectory()
        self.addCleanup(self.temporary.cleanup)
        self.root = Path(self.temporary.name)
        for name in ("lectures", "quizzes", "lessons/01_routing", "lessons/02_dns"):
            (self.root / name).mkdir(parents=True, exist_ok=True)
        for topic, prefix in (("01_routing", "routing"), ("02_dns", "dns")):
            lecture = f"lectures/lecture_{topic}.md"
            quiz = f"quizzes/quiz_{topic}.json"
            lesson = f"lessons/{topic}/01_intro.md"
            (self.root / lecture).write_text("# Source\n\n## Teaching\n\nRetained teaching.\n\n```mermaid\nflowchart LR\n A --- B\n```\n")
            question = {"question": "Which answer?", "options": ["Yes", "No"], "correct_answers": [0],
                        "explanation": "", "lesson_id": f"{prefix}-01", "tags": [], "flags": []}
            self.write(quiz, {"topic": topic, "questions": [question]})
            (self.root / lesson).write_text(f"---\nid: {prefix}-01\n---\n\n# Intro\n\nRetained teaching.\n\n```mermaid\nflowchart LR\n A --- B\n```\n\n## Practice\n\nQ001\n")
            self.write(f"lessons/{topic}/manifest.json", {
                "topic_id": topic, "title": prefix, "preparation_status": "reviewed",
                "source_lecture": lecture, "source_quiz": quiz,
                "coverage_counts": {f"{prefix}_lesson": 1}, "flag_counts": {},
                "lessons": [{"id": f"{prefix}-01", "path": lesson, "question_ids": [f"{prefix}-q001"], "prerequisite_ids": []}],
                "question_links": [{"question_id": f"{prefix}-q001", "source_index": 0,
                    "question_sha256": question_fingerprint(question), "lesson_id": f"{prefix}-01",
                    "related_lesson_ids": [], "required_lesson_ids": [], "optional_lesson_ids": [],
                    "coverage_status": f"{prefix}_lesson", "flags": [],
                    "evidence": [{"path": lecture, "section": "Teaching"}]}],
            })

    def read(self, name):
        return json.loads((self.root / name).read_text())

    def write(self, name, value):
        (self.root / name).write_text(json.dumps(value))

    def git(self, *args):
        return subprocess.run(["git", *args], cwd=self.root, capture_output=True, text=True, check=True)

    def baseline(self):
        self.git("init", "-q")
        self.git("add", ".")
        self.git("-c", "user.name=Content Test", "-c", "user.email=test@example.invalid", "commit", "-qm", "fixture")

    def errors(self):
        return validate(self.root)[0].errors

    def test_valid_content_and_source_loss(self):
        self.assertEqual(self.errors(), [])
        lesson = self.root / "lessons/02_dns/01_intro.md"
        lesson.write_text(lesson.read_text().replace("Retained teaching.", "Lost teaching."))
        self.assertTrue(any("source lines absent" in error for error in self.errors()))

    def test_fingerprint_and_answer_key_preservation(self):
        self.baseline()
        path = "quizzes/quiz_02_dns.json"
        quiz = self.read(path)
        quiz["questions"][0]["tags"] = ["manual"]
        self.write(path, quiz)
        self.assertEqual(validate(self.root, baseline="HEAD")[0].errors, [])
        quiz["questions"][0]["correct_answers"] = [1]
        self.write(path, quiz)
        self.assertTrue(any("answer key differs" in error for error in validate(self.root, baseline="HEAD")[0].errors))
        quiz["questions"][0]["question"] = "Different question?"
        self.write(path, quiz)
        self.assertTrue(any("fingerprint mismatch" in error for error in self.errors()))

    def test_dependency_cycle_and_broken_link(self):
        name = "lessons/02_dns/manifest.json"
        manifest = self.read(name)
        manifest["lessons"][0]["prerequisite_ids"] = ["dns-01"]
        self.write(name, manifest)
        lesson = self.root / "lessons/02_dns/01_intro.md"
        lesson.write_text(lesson.read_text() + "\n[Missing](missing.md)\n")
        errors = self.errors()
        self.assertTrue(any("Prerequisite cycle" in error for error in errors))
        self.assertTrue(any("broken link" in error for error in errors))

    def test_cross_topic_reference_counted_only_at_source(self):
        rp = "lessons/01_routing/manifest.json"
        dp = "lessons/02_dns/manifest.json"
        routing, dns = self.read(rp), self.read(dp)
        routing["question_links"][0].update(lesson_id="dns-01", coverage_status="covered_in_other_topic")
        routing["coverage_counts"] = {"covered_in_other_topic": 1}
        routing["lessons"][0]["question_ids"] = []
        dns["lessons"][0]["external_question_ids"] = ["routing-q001"]
        dns["external_question_links"] = [{"question_id": "routing-q001", "source_quiz": routing["source_quiz"],
            "source_index": 0, "canonical_manifest": rp, "lesson_id": "dns-01"}]
        quiz = self.read(routing["source_quiz"])
        quiz["questions"][0]["lesson_id"] = "dns-01"
        self.write(routing["source_quiz"], quiz)
        self.write(rp, routing)
        self.write(dp, dns)
        self.assertEqual(self.errors(), [])
        data = collect(self.root)
        self.assertEqual(sum(topic["question_count"] for topic in data["topics"]), 2)
        self.assertEqual(sum(topic["assigned"] for topic in data["topics"]), 2)
        dns["external_question_links"] = []
        self.write(dp, dns)
        self.assertTrue(any("external references" in error for error in self.errors()))

    def test_live_counts_ignore_cached_totals_and_flags_overlap(self):
        path = "lessons/02_dns/manifest.json"
        manifest = self.read(path)
        manifest["coverage_counts"] = {"dns_lesson": 900}
        manifest["question_links"][0]["flags"] = ["wording_issue", "duplicate_question"]
        quiz = self.read(manifest["source_quiz"])
        quiz["questions"][0]["flags"] = ["wording_issue", "duplicate_question"]
        self.write(manifest["source_quiz"], quiz)
        self.write(path, manifest)
        data = collect(self.root)
        dns = next(topic for topic in data["topics"] if topic["number"] == 2)
        self.assertEqual(dns["coverage"], Counter(own=1))
        self.assertEqual(dns["review_questions"], 1)
        self.assertEqual(dns["flags"]["wording_issue"], 1)
        self.assertTrue(any("stale coverage_counts" in error for error in self.errors()))
        self.assertEqual(render(data), render(collect(self.root)))

    def test_scaffold_isolated_and_refuses_existing_destination(self):
        self.baseline()
        original = (self.root / "quizzes/quiz_02_dns.json").read_bytes()
        destination = self.root / "draft"
        scaffold(self.root, "02_dns", destination)
        self.assertTrue((destination / "manifest.draft.json").is_file())
        self.assertFalse((destination / "manifest.json").exists())
        self.assertEqual((self.root / "quizzes/quiz_02_dns.json").read_bytes(), original)
        self.assertEqual(len(collect(self.root)["topics"]), 2)
        with self.assertRaisesRegex(ValueError, "overwrite"):
            scaffold(self.root, "02_dns", destination)

    def test_planned_shell_and_bad_plan_leaves_no_destination(self):
        self.baseline()
        plan = self.root / "plan.json"
        item = {"slug": "intro", "title": "Introduction", "learning_goals": ["Explain the example."],
                "source_sections": ["Teaching"], "source_classification": "lecture_guide"}
        plan.write_text(json.dumps({"lessons": [item]}))
        destination = self.root / "planned"
        scaffold(self.root, "02_dns", destination, plan)
        self.assertIn("TODO-CONTENT", (destination / "01_intro.md").read_text())
        draft = json.loads((destination / "manifest.draft.json").read_text())
        self.assertEqual(draft["question_links"][0]["coverage_status"], "unassessed")
        self.assertNotIn("required_lesson_ids", draft["question_links"][0])
        item["source_sections"] = ["Nonexistent heading"]
        plan.write_text(json.dumps({"lessons": [item]}))
        rejected = self.root / "rejected"
        with self.assertRaisesRegex(ValueError, "absent"):
            scaffold(self.root, "02_dns", rejected, plan)
        self.assertFalse(rejected.exists())


if __name__ == "__main__":
    unittest.main()
