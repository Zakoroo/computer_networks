"""Content boundary checks for the generated app catalogue."""

import json
from pathlib import Path
import sys
import unittest

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from build_app_content import build_catalogue, lesson_body
from content_data import ROOT


class AppContentTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.catalogue, _ = build_catalogue()

    def test_questions_preserve_every_learner_field_and_cross_topic_identity(self):
        catalogue = self.catalogue
        ids = [q['question_id'] for q in catalogue['questions']]
        self.assertEqual(len(ids), len(set(ids)))
        for question in catalogue['questions']:
            original = json.loads((ROOT / question['source_quiz']).read_text())['questions'][question['source_index']]
            for key in ('question', 'options', 'correct_answers', 'explanation', 'tags', 'flags', 'lesson_id'):
                self.assertEqual(question[key], original[key], (question['question_id'], key))
        cross_topic = [q for q in catalogue['questions'] if q['question_id'] == 'routing-q036']
        self.assertEqual(len(cross_topic), 1)
        self.assertEqual(cross_topic[0]['lesson_id'], 'dns-18')

    def test_reader_removes_scaffolding_but_keeps_teaching_fences_and_source(self):
        text = '---\nid: test-01\n---\n# Title\n\n## Explanation\nKeep this.\n```text\n## Practice\nKeep code too.\n```\n## Practice\nQuestion/key scaffolding\n## Source\nLecture link\n[Topic overview](README.md) · [Next lesson](next.md)\n'
        body = lesson_body(text)
        self.assertIn('Keep this.', body)
        self.assertIn('## Practice\nKeep code too.', body)
        self.assertIn('## Source\nLecture link', body)
        self.assertNotIn('Question/key scaffolding', body)
        self.assertNotIn('[Topic overview]', body)
        self.assertNotIn('id: test-01', body)

    def test_complete_reading_and_unknown_dependencies_survive_generation(self):
        catalogue = self.catalogue
        self.assertEqual(len(catalogue['topics']), 6)
        self.assertTrue(any(not any(q['lesson_id'] == lesson['id'] for q in catalogue['questions']) for lesson in catalogue['lessons']))
        question = next(q for q in catalogue['questions'] if q['question_id'] == 'routing-q001')
        self.assertIsNone(question['required_lesson_ids'])
        self.assertEqual(question['dependency_status'], 'unclassified')
        self.assertEqual(build_catalogue()[0]['content_version'], catalogue['content_version'])


if __name__ == '__main__':
    unittest.main()
