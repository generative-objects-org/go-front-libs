import { predicateToString } from '../../src/libs/go-predicate-model';

describe('GO Predicate', function() {
    describe('predicateToString', function() {
        let emptyGroup = {
            operator: '&&',
            conditions: []
        };

        it('should convert empty group to empty string', function() {
            predicateToString(emptyGroup).should.be.empty;
        });

        // Let's try converting all these operators
        let conditionListBinaryOperators = [
            {
                left: 'CustomerId',
                operator: '==',
                right: '"2374669d-eb56-4999-b4d5-30cbcfef32aa"',
                order: 1,
                result: 'CustomerId == "2374669d-eb56-4999-b4d5-30cbcfef32aa"'
            },
            {
                left: 'Amount',
                operator: '<',
                right: '41',
                order: 4,
                result: 'Amount < 41'
            },
            {
                left: 'Test',
                operator: '!=',
                right: '1',
                order: 2,
                result: 'Test != 1'
            },
            {
                left: 'Amount',
                operator: '<=',
                right: '45',
                order: 3,
                result: 'Amount <= 45'
            },
            {
                left: 'Title',
                operator: '>=',
                right: '"AA"',
                order: 6,
                result: 'Title >= "AA"'
            },
            {
                left: 'Amount',
                operator: '>',
                right: '78',
                order: 5,
                result: 'Amount > 78'
            }
        ];

        conditionListBinaryOperators.forEach((cond, i) => {
            it(
                'should convert BINARY condition ' +
                    i +
                    ' to string ' +
                    cond.result,
                function() {
                    predicateToString(cond).should.equal(cond.result);
                }
            );
        });

        let conditionListStringOperator = [
            {
                left: 'Name',
                operator: 'StartsWith',
                right: '"Bla"',
                order: 1,
                result: 'Name.StartsWith("Bla")'
            },
            {
                left: 'FirstName',
                operator: 'EndsWith',
                right: '"Bla"',
                order: 2,
                result: 'FirstName.EndsWith("Bla")'
            },
            {
                left: 'LastName',
                operator: 'Contains',
                right: '"Bla"',
                order: 3,
                result: 'LastName.Contains("Bla")'
            }
        ];

        conditionListStringOperator.forEach((cond, i) => {
            it(
                'should convert STRING condition ' +
                    i +
                    ' to string ' +
                    cond.result,
                function() {
                    predicateToString(cond).should.equal(cond.result);
                }
            );
        });

        it('should convert ConditionGroup to proper string with right order', function() {
            predicateToString({
                conditions: conditionListBinaryOperators,
                operator: '&&'
            }).should.equal(
                '(CustomerId == "2374669d-eb56-4999-b4d5-30cbcfef32aa" && Test != 1 && Amount <= 45 && Amount < 41 && Amount > 78 && Title >= "AA")'
            );
        });

        it('should convert imbricated ConditionGroup to proper string', function() {
            predicateToString({
                conditions: [
                    {
                        conditions: conditionListBinaryOperators,
                        operator: '&&',
                        order: 1
                    },
                    {
                        conditions: conditionListStringOperator,
                        operator: '&&',
                        order: 2
                    }
                ],
                operator: '||'
            }).should.equal(
                '((CustomerId == "2374669d-eb56-4999-b4d5-30cbcfef32aa" && Test != 1 && Amount <= 45 && Amount < 41 && Amount > 78 && Title >= "AA") || (Name.StartsWith("Bla") && FirstName.EndsWith("Bla") && LastName.Contains("Bla")))'
            );
        });

        it('should negate condition', function() {
            predicateToString({
                left: 'Id',
                operator: '==',
                right: 2,
                negate: true
            }).should.equal('!(Id == 2)');
        });

        it('should fail to convert when not condition', function() {
            (function() {
                predicateToString({});
            }.should.throw(
                'Predicate is neither a Condition or ConditionGroup'
            ));
        });

        it('should fail with invalid condition operator', function() {
            (function() {
                predicateToString({
                    left: 'A',
                    operator: 'xx',
                    right: 1
                });
            }.should.throw('Operator xx is not valid'));
        });

        it('should fail with invalid group operator', function() {
            (function() {
                predicateToString({
                    operator: 'xx',
                    conditions: conditionListBinaryOperators
                });
            }.should.throw('Operator xx is not valid for group'));
        });
    });
});
