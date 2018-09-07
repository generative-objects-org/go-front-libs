import * as datasetBuilder from '../../src/libs/go-api-adapter';
import 'chai/register-should';

describe('GO Dataset', function() {
    describe('buildPrimaryKey', function() {
        let dummyObject = { Id: 1, Name: 'Thomas', Account: null };

        it('should create PK object for single key', function() {
            let key = datasetBuilder.buildPrimaryKey(dummyObject, 'Id');

            key.should.deep.equal(1);
        });

        it('should create PK object for multiple key', function() {
            let key = datasetBuilder.buildPrimaryKey(dummyObject, 'Id', 'Name');

            key.should.deep.equal({ Id: 1, Name: 'Thomas' });
        });

        it('should fail without entity', function() {
            (function() {
                datasetBuilder.buildPrimaryKey(null, 'A');
            }.should.throw(
                'buildPrimaryKey takes an entity object as first parameter'
            ));
            (function() {
                datasetBuilder.buildPrimaryKey(function() {}, 'A');
            }.should.throw(
                'buildPrimaryKey takes an entity object as first parameter'
            ));
        });

        it('should fail without key name', function() {
            (function() {
                datasetBuilder.buildPrimaryKey(dummyObject);
            }.should.throw(
                'buildPrimaryKey takes at least one key name as second parameter'
            ));
        });
    });

    describe('createEmptyDataset', function() {
        it('should create empty dataset', function() {
            let empty = datasetBuilder.createEmptyDataset();

            empty.should.deep.equal({
                InternalObjectId: 0,
                ObjectsDataSet: {
                    $type: 'ObjectsDataSet'
                }
            });
        });
    });

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
            datasetBuilder
                .buildDataset('Customer')
                .should.deep.equal(datasetBuilder.createEmptyDataset());
        });

        it('should create dataset with one entity', function() {
            let result = datasetBuilder.buildDataset(
                'Customer',
                [dummyCustomer],
                'Id'
            );

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
            let result = datasetBuilder.buildDataset(
                'Customer',
                [dummyCustomer, dummyCustomer2],
                'Id'
            );

            result.should.deep.equal({
                InternalObjectId: 2,
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

        it('should throw an Error when PK fields is absent', function() {
            (function() {
                datasetBuilder.buildDataset('Customer', [dummyCustomer]);
            }.should.throw(
                'You must specify the PK field(s) for the main entity'
            ));
        });
    });

    describe('addEntitiesToDataset', function() {
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
        let dummyContract = { Id: 1, Title: 'MyContract', CustomerId: 1 };

        it('should work when adding another entity to existing dataset of same kind', function() {
            let result = datasetBuilder.buildDataset(
                'Customer',
                [dummyCustomer],
                'Id'
            );

            datasetBuilder.addEntitiesToDataset(
                'Customer',
                [dummyCustomer2],
                result
            );

            result.should.deep.equal({
                InternalObjectId: 2,
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

        it('should add entity to existing dataset', function() {
            let result = datasetBuilder.buildDataset(
                'Customer',
                [dummyCustomer, dummyCustomer2],
                'Id'
            );
            datasetBuilder.addEntitiesToDataset(
                'Contract',
                [dummyContract],
                result
            );

            result.should.deep.equal({
                InternalObjectId: 3,
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
                    },
                    ContractObjectsDataSet: {
                        ContractObjects: {
                            3: { Id: 1, Title: 'MyContract', CustomerId: 1 }
                        }
                    }
                }
            });
        });

        it('should fail if no dataset is specified', function() {
            let result = datasetBuilder.buildDataset(
                'Customer',
                [dummyCustomer, dummyCustomer2],
                'Id'
            );
            (function() {
                datasetBuilder.addEntitiesToDataset('Contract', [
                    dummyContract
                ]);
            }.should.throw('You must specify the dataset to add entities to'));
        });

        it('should fail when resourceName is empty', function() {
            let result = datasetBuilder.buildDataset(
                'Customer',
                [dummyCustomer, dummyCustomer2],
                'Id'
            );
            (function() {
                datasetBuilder.addEntitiesToDataset();
            }.should.throw(
                'You must specify the resourceName to use for this dataset ("main entity")'
            ));
        });
    });
});
