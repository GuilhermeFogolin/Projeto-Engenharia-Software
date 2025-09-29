class UnitTestConfig:
    
    def __init__(self) -> None:
        self.unit_test = False

    def set_unit_test(self, unit_test):
        self.unit_test = unit_test

    def get_unit_test(self):
        return self.unit_test

unittest_config = UnitTestConfig()