"""Query behavior, cross-topic identity, and read-only guarantees."""

from contextlib import redirect_stderr, redirect_stdout
import io
import json
from pathlib import Path
import sys
import tempfile
import unittest

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from content_data import question_fingerprint
from query_quizzes import load_questions, main


class QueryQuizzesTests(unittest.TestCase):
    def setUp(self):
        temporary = tempfile.TemporaryDirectory()
        self.addCleanup(temporary.cleanup)
        self.root = Path(temporary.name)
        (self.root / "quizzes").mkdir()
        for topic in ("01_routing", "02_dns"):
            (self.root / "lessons" / topic).mkdir(parents=True)
        def question(stem, lesson="", flags=None, tags=None, options=None):
            return {"question": stem, "options": options or ["Yes", "No"], "correct_answers": [0],
                    "lesson_id": lesson, "flags": flags or [], "tags": tags or [], "explanation": ""}
        routing = [
            question("First question", "dns-01", ["cross_topic", "wording_issue"], ["review"], ["MiXeD marker", "Other"]),
            question("Fragmentation IPv6.* example", flags=["coverage_gap"]),
            question("Third question", "routing-01", tags=["easy"]),
        ]
        dns = [question("DNS lookup", "dns-01")]
        self.write("quizzes/quiz_01_routing.json", {"topic": "Routing", "questions": routing})
        self.write("quizzes/quiz_02_dns.json", {"topic": "DNS", "questions": dns})
        self.write("quizzes/quiz_04_tcp.json", {"topic": "TCP", "questions": [question("Unassessed TCP")]})
        self.write("quizzes/quiz_07_algorithm.json", {"topic": "Algorithm", "questions": [question("Algorithm question")]})
        def manifest(topic, prefix, questions):
            links = []
            for index, q in enumerate(questions):
                links.append({"question_id": f"{prefix}-q{index + 1:03}", "source_index": index,
                    "question_sha256": question_fingerprint(q), "lesson_id": q["lesson_id"],
                    "flags": q["flags"], "related_lesson_ids": [], "required_lesson_ids": [],
                    "optional_lesson_ids": [], "coverage_status": f"{prefix}_lesson", "evidence": []})
            return {"topic_id": topic, "source_quiz": f"quizzes/quiz_{topic}.json", "question_links": links,
                    "lessons": [{"id": f"{prefix}-01", "title": prefix.title(), "path": f"lessons/{topic}/01_intro.md"}]}
        r = manifest("01_routing", "routing", routing)
        r["question_links"][0].update(coverage_status="covered_in_other_topic", required_lesson_ids=["routing-01"], related_lesson_ids=["routing-01"])
        legacy = r["question_links"][1]
        legacy.update(coverage_status="not_found_in_available_lectures", related_lesson_ids=["routing-01", "dns-01"])
        legacy.pop("required_lesson_ids")
        legacy.pop("optional_lesson_ids")
        self.write("lessons/01_routing/manifest.json", r)
        d = manifest("02_dns", "dns", dns)
        d["external_question_links"] = [{"question_id": "routing-q001", "source_index": 0,
            "source_quiz": "quizzes/quiz_01_routing.json", "canonical_manifest": "lessons/01_routing/manifest.json", "lesson_id": "dns-01"}]
        self.write("lessons/02_dns/manifest.json", d)

    def write(self, path, value):
        (self.root / path).write_text(json.dumps(value), encoding="utf-8")

    def run_query(self, *args):
        output, error = io.StringIO(), io.StringIO()
        with redirect_stdout(output), redirect_stderr(error):
            main(list(args), root=self.root)
        self.assertEqual(error.getvalue(), "")
        return output.getvalue()

    def json_query(self, *args):
        return json.loads(self.run_query("--json", *args))

    def test_scope_and_unmanifested_identity(self):
        rows, _ = load_questions(self.root)
        self.assertEqual(len(rows), 5)
        self.assertEqual(len(load_questions(self.root, "all")[0]), 6)
        self.assertEqual(len(load_questions(self.root, "algorithms")[0]), 1)
        row = self.json_query("--topic", "04", "--coverage", "unassessed")["results"][0]
        self.assertIsNone(row["question_id"])
        self.assertEqual(row["source_ref"], "quizzes/quiz_04_tcp.json#Q001")
        self.assertIsNone(row["required_lesson_ids"])
        self.assertEqual(row["source_index"], 0)

    def test_cross_topic_roles_and_unclassified_dependencies(self):
        result = self.json_query("--lesson", "dns-01", "--lesson-role", "primary")
        self.assertEqual([r["question_id"] for r in result["results"]], ["routing-q001", "dns-q001"])
        self.assertEqual(result["results"][0]["source_quiz"], "quizzes/quiz_01_routing.json")
        result = self.json_query("--requires", "routing-01")
        self.assertEqual([r["question_id"] for r in result["results"]], ["routing-q001"])
        legacy = self.json_query("--id", "routing-q002")["results"][0]
        self.assertIsNone(legacy["required_lesson_ids"])
        self.assertEqual(legacy["dependency_status"], "unclassified")
        self.assertEqual(self.json_query("--multi-lesson")["total"], 1)
        self.assertEqual(self.json_query("--lesson", "routing-01", "--lesson-role", "related")["total"], 2)

    def test_or_values_and_criteria_intersection(self):
        result = self.json_query("--flag", "wording_issue", "--flag", "coverage_gap")
        self.assertEqual(result["total"], 2)
        result = self.json_query("--flag", "wording_issue", "--flag", "coverage_gap", "--unmapped", "--untagged")
        self.assertEqual([r["question_id"] for r in result["results"]], ["routing-q002"])
        self.assertEqual(self.json_query("--topic", "01", "--tag", "review", "--tag", "easy")["total"], 2)

    def test_literal_option_search_and_no_match(self):
        self.assertEqual(self.json_query("--search", "mixed MARKER")["results"][0]["question_id"], "routing-q001")
        self.assertEqual(self.json_query("--search", "ipv6.*")["total"], 1)
        self.assertEqual(self.json_query("--search", "not present")["results"], [])

    def test_pagination_preserves_ids_and_count_ignores_page(self):
        result = self.json_query("--topic", "01_routing", "--offset", "2", "--limit", "1")
        self.assertEqual(result["total"], 3)
        self.assertEqual(result["results"][0]["source_index"], 2)
        self.assertEqual(result["results"][0]["question_id"], "routing-q003")
        self.assertEqual(self.run_query("--topic", "01", "--count", "--offset", "900", "--limit", "1").strip(), "3")
        self.assertEqual(self.json_query("--count", "--limit", "1"), {"total": 5})
        self.assertEqual(len(self.json_query("--offset", "2", "--limit", "0")["results"]), 3)

    def test_details_are_opt_in_and_queries_do_not_write(self):
        before = {p: p.read_bytes() for p in self.root.rglob("*") if p.is_file()}
        compact = self.json_query("--id", "routing-q001")["results"][0]
        self.assertNotIn("correct_answers", compact)
        self.assertNotIn("options", compact)
        detailed = self.json_query("--id", "routing-q001", "--details")["results"][0]
        self.assertEqual(detailed["correct_answers"], [0])
        self.assertEqual(detailed["primary_lesson"]["id"], "dns-01")
        self.assertEqual(detailed["supporting_lessons"][0]["id"], "routing-01")
        self.assertIn("* [0] MiXeD marker", self.run_query("--id", "routing-q001", "--details"))
        self.assertEqual({p: p.read_bytes() for p in self.root.rglob("*") if p.is_file()}, before)

    def test_stale_question_and_assignment_are_rejected(self):
        path = "quizzes/quiz_01_routing.json"
        data = json.loads((self.root / path).read_text())
        data["questions"][0]["lesson_id"] = "routing-01"
        self.write(path, data)
        with self.assertRaisesRegex(ValueError, "assignment or flag mismatch"):
            load_questions(self.root)
        data["questions"][0]["lesson_id"] = "dns-01"
        data["questions"][0]["options"].reverse()
        self.write(path, data)
        with self.assertRaisesRegex(ValueError, "Stale fingerprint"):
            load_questions(self.root)

    def test_invalid_selectors_and_arguments_exit_cleanly(self):
        for args in (("--topic", "missing"), ("--topic", "07"), ("--lesson", "absent-01"),
                     ("--limit", "-1"), ("--offset", "-1"), ("--tag", "review", "--untagged")):
            with self.subTest(args=args), redirect_stdout(io.StringIO()), redirect_stderr(io.StringIO()):
                with self.assertRaises(SystemExit) as error:
                    main(list(args), root=self.root)
                self.assertEqual(error.exception.code, 2)


if __name__ == "__main__":
    unittest.main()
