import {
    newGuid,
    isGuid
} from '../../src/libs/go-uuid.js';
import 'chai/register-should';

describe('GO Math', function () {
    describe('isGuid', function () {
        let testsTrue = [
            '2374669d-eb56-4999-b4d5-30cbcfef32aa',
            '00000000-0000-0000-0000-000000000000'
        ];
        testsTrue.forEach(test => {
            it('should validate GUID: ' + test, function () {
                isGuid(test).should.be.true;
            });
        });

        let testsFalse = [
            '',
            null,
            45,
            'test',
            'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
            '2374669d-eb56-7999-b4d5-30cbcfef32aa' // Wrong version byte
        ];
        testsFalse.forEach(test => {
            it('should not validate GUID: ' + test, function () {
                isGuid(test).should.be.false;
            });
        });
    });

    describe('newGuid', function () {
        it('should return a string', function () {
            let result = newGuid();

            result.should.be.a('string');
        });

        it('should have length 36', function () {
            let result = newGuid();

            result.should.have.length(36);
        });

        it('should match the X-X-X-X pattern', function () {
            let result = newGuid();

            isGuid(result).should.be.true;
        });

        it('should be a version 4 GUID', function () {
            let result = newGuid();
            result[14].should.equal('4');
        });

        it('should generate different GUID', function () {
            let result = newGuid();
            let result2 = newGuid();
            let result3 = newGuid();
            result.should.not.equal(result2);
            result.should.not.equal(result3);
            result2.should.not.equal(result3);
        });
    });
});