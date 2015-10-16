import unittest
from acpBrevit import acpBrevit, addTouple

class TestACP(unittest.TestCase):
	def test_addTouple(self):
		self.assertEqual( addTouple((1,0),(1,1)),(2,1))

	def test_range1(self):
		self.assertEqual( acpBrevit(0), (60,0))

	def test_range1(self):
		self.assertEqual( acpBrevit(10), (17,40))

	def test_60(self):
		self.assertEqual( acpBrevit(60), (106,240))

	def test_120(self):
		self.assertEqual( acpBrevit(120), (212,480))

	def test_175(self):
		self.assertEqual( acpBrevit(175), (309,700))

	def test_Max(self):
		self.assertEqual( acpBrevit(200), (353,780))

if __name__ == '__main__':
	unittest.main()
