import { cleanResultFromRefMentions } from '../../src/libs/go-api-adapter';
import 'chai/register-should';

describe('GO API Cleaning', function() {
    describe('cleanResultFromRefMentions', function() {
        it('should return element unchanged if not concerned', function() {
            let result = cleanResultFromRefMentions('Test', []);
            result.should.equal('Test');
        });

        it('should return a cleaned array -- 1-level deep', function() {
            let initialArray = [
                {
                    Amount: 0,
                    Customer: {
                        $id: 2,
                        Id: '38f02943-b04f-4327-8b28-329016a3d510',
                        FirstName: 'John',
                        LastName: 'Doe'
                    },
                    CustomerId: '38f02943-b04f-4327-8b28-329016a3d510',
                    Id: 'ebc2bd8b-5f9d-4ece-a733-0d9dc53183e6'
                },
                {
                    Amount: 10,
                    Customer: {
                        $ref: 2
                    },
                    CustomerId: '38f02943-b04f-4327-8b28-329016a3d510',
                    Id: 'e6b071b8-f3c8-41dd-b2ea-363085c115e7'
                },
                {
                    Amount: 5,
                    Customer: {
                        $ref: 2
                    },
                    CustomerId: '38f02943-b04f-4327-8b28-329016a3d510',
                    Id: 'e5f2b798-d5d7-49a6-80f3-6441947d463e'
                }
            ];

            let cleanedArray = [
                {
                    Amount: 0,
                    Customer: {
                        $id: 2,
                        Id: '38f02943-b04f-4327-8b28-329016a3d510',
                        FirstName: 'John',
                        LastName: 'Doe'
                    },
                    CustomerId: '38f02943-b04f-4327-8b28-329016a3d510',
                    Id: 'ebc2bd8b-5f9d-4ece-a733-0d9dc53183e6'
                },
                {
                    Amount: 10,
                    Customer: null,
                    CustomerId: '38f02943-b04f-4327-8b28-329016a3d510',
                    Id: 'e6b071b8-f3c8-41dd-b2ea-363085c115e7'
                },
                {
                    Amount: 5,
                    Customer: null,
                    CustomerId: '38f02943-b04f-4327-8b28-329016a3d510',
                    Id: 'e5f2b798-d5d7-49a6-80f3-6441947d463e'
                }
            ];

            let result = cleanResultFromRefMentions(initialArray, ['Customer']);

            result.should.deep.equal(cleanedArray);
        });

        it('should return a cleaned array -- 2-level deep', function() {
            let initialArray = [
                {
                    $id: 1,
                    Title: 'AB',
                    CustomerId: 1,
                    Customer: {
                        $id: 2,
                        AddressId: 'AA',
                        Address: {
                            $id: 3,
                            Street: 'France'
                        }
                    }
                },
                {
                    $id: 4,
                    Title: 'BC',
                    CustomerId: 2,
                    Customer: {
                        $id: 5,
                        AddressId: 'AA',
                        Address: {
                            $ref: 3
                        }
                    }
                }
            ];

            let cleanedArray = [
                {
                    $id: 1,
                    Title: 'AB',
                    CustomerId: 1,
                    Customer: {
                        $id: 2,
                        AddressId: 'AA',
                        Address: {
                            $id: 3,
                            Street: 'France'
                        }
                    }
                },
                {
                    $id: 4,
                    Title: 'BC',
                    CustomerId: 2,
                    Customer: {
                        $id: 5,
                        AddressId: 'AA',
                        Address: null
                    }
                }
            ];

            let result = cleanResultFromRefMentions(initialArray, [
                'UnusedInclude',
                'Customer.Address'
            ]);

            result.should.deep.equal(cleanedArray);
        });

        it('should return a cleaned array -- root level deep', function() {
            let initialArray = [
                {
                    $id: 1,
                    test: 1
                },
                { $ref: 1 },
                { $id: 2, test: 3 }
            ];

            let cleanedArray = [{ $id: 1, test: 1 }, { $id: 2, test: 3 }];

            let result = cleanResultFromRefMentions(initialArray, []);

            result.should.deep.equal(cleanedArray);
        });
    });
});
