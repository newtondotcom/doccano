import os
import unittest

import polars as pl
from pandas.testing import assert_frame_equal

from ..pipeline.writers import CsvWriter, FastTextWriter, JsonlWriter, JsonWriter


class TestWriter(unittest.TestCase):
    def setUp(self):
        self.dataset = pl.DataFrame(
            [
                {"id": 0, "text": "A"},
                {"id": 1, "text": "B"},
                {"id": 2, "text": "C"},
            ]
        )
        self.file = "tmp.csv"

    def tearDown(self):
        os.remove(self.file)


class TestCSVWriter(TestWriter):
    def test_write(self):
        writer = CsvWriter()
        writer.write(self.file, self.dataset)
        loaded_dataset = pl.read_csv(self.file)
        assert_frame_equal(self.dataset, loaded_dataset)


class TestJsonWriter(TestWriter):
    def test_write(self):
        writer = JsonWriter()
        writer.write(self.file, self.dataset)
        loaded_dataset = pl.read_json(self.file)
        assert_frame_equal(self.dataset, loaded_dataset)


class TestJsonlWriter(TestWriter):
    def test_write(self):
        writer = JsonlWriter()
        writer.write(self.file, self.dataset)
        loaded_dataset = pl.read_json(self.file, lines=True)
        assert_frame_equal(self.dataset, loaded_dataset)


class TestFastText(unittest.TestCase):
    def setUp(self):
        self.expected = "__label__A exampleA\n__label__B exampleB"
        self.dataset = pl.DataFrame([*zip(self.expected.split("\n"))])

    def test_write(self):
        file = "tmp.txt"
        writer = FastTextWriter()
        writer.write(file, self.dataset)
        loaded_dataset = open(file, encoding="utf-8").read().strip()
        self.assertEqual(loaded_dataset, self.expected)
