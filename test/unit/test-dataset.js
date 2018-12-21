import * as datasetBuilder from '../../src/libs/go-api-adapter';
import 'chai/register-should';

describe('GO Dataset', function() {
    describe('buildDataset', function() {
        let dummyCustomer = {
            Id: 1,
            FirstName: 'Thomas',
            LastName: 'Villaren'
        };
        let dummyCustomer2 = {
            Id: 2,
            FirstName: 'Walter',
            LastName: 'Almeida'
        };

        it('should create empty dataset if nothing provided', function() {
            datasetBuilder.buildDataset().should.deep.equal({
                InternalObjectId: 1,
                ObjectsDataSet: {
                    $type: 'ObjectsDataSet'
                }
            });
        });

        it('should create dataset with one entity', function() {
            let result = datasetBuilder.buildDataset([
                { name: 'Customer', data: dummyCustomer, pkFields: ['Id'] }
            ]);

            result.should.deep.equal({
                InternalObjectId: 1,
                PrimaryKey: 1,
                ObjectsDataSet: {
                    $type: 'ObjectsDataSet',
                    CustomerObjectsDataSet: {
                        CustomerObjects: {
                            1: {
                                Id: 1,
                                FirstName: 'Thomas',
                                LastName: 'Villaren'
                            }
                        }
                    }
                }
            });
        });

        it('should create dataset with 2 entities', function() {
            let result = datasetBuilder.buildDataset([
                {
                    name: 'Customer',
                    data: dummyCustomer,
                    pkFields: ['Id']
                },
                {
                    name: 'Customer',
                    data: dummyCustomer2,
                    pkFields: ['Id']
                }
            ]);

            result.should.deep.equal({
                InternalObjectId: 1,
                PrimaryKey: 1,
                ObjectsDataSet: {
                    $type: 'ObjectsDataSet',
                    CustomerObjectsDataSet: {
                        CustomerObjects: {
                            1: {
                                Id: 1,
                                FirstName: 'Thomas',
                                LastName: 'Villaren'
                            },
                            2: {
                                Id: 2,
                                FirstName: 'Walter',
                                LastName: 'Almeida'
                            }
                        }
                    }
                }
            });
        });

        it('should create dataset with entity having 2 PKs', function() {
            let result = datasetBuilder.buildDataset([
                {
                    name: 'Customer',
                    data: dummyCustomer,
                    pkFields: ['Id', 'FirstName']
                }
            ]);

            result.should.deep.equal({
                InternalObjectId: 1,
                PrimaryKey: {
                    Id: 1,
                    FirstName: 'Thomas'
                },
                ObjectsDataSet: {
                    $type: 'ObjectsDataSet',
                    CustomerObjectsDataSet: {
                        CustomerObjects: {
                            1: {
                                Id: 1,
                                FirstName: 'Thomas',
                                LastName: 'Villaren'
                            }
                        }
                    }
                }
            });
        });

        it('should throw an Error when PK fields is absent', function() {
            (function() {
                datasetBuilder.buildDataset([
                    { data: dummyCustomer, name: 'Customer' }
                ]);
            }.should.throw(
                'You must specify the PK field(s) for the first entity'
            ));
        });
        it('should throw an Error when Entity name is absent', function() {
            (function() {
                datasetBuilder.buildDataset([
                    { data: dummyCustomer, pkFields: ['Id'] }
                ]);
            }.should.throw('You must specify the Entity Name for each entity'));
        });
    });
});
