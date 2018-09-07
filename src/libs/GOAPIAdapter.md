# GO Api Adapter library

This library exposes several method to convert POJO (_Plain Old JavaScript Objects_) to Generative Objects dataset format and to clean GO API results (non-dataset format) to be used by GO generated apps. These are meant to be use when sending data to the server (for save) or clean after fetching data there. Here are the exposed methods:

## Sending data to the server

### buildDataset

`buildDataset(resourceName, entities, ...pkFields)` is the main function to be used by generated code. It calls the three other methods (which are also exposed because they are needed in specific cases throughout the code).

This function must be called to create a dataset for a _single type_ of entities, described by the `resourceName` parameter. If additional entities of other types need to be added, we'll use the `addEntities` function.
The `entities` argument is an _Array_ of entities.
The `pkFields` arguments are the names of the PKs for the given entity, which is called the "main entity" because it is the entity used to create the dataset.

The function return a JS object matching the following structure:

```javascript
{
    "InternalObjectId": 1 //Arbitrary number (set to 1 in our code),
    "PrimaryKey": 'xxxx-xxx' //The PK of our main entity, a GUID for instance
    "ObjectsDataSet": {
        "$type": "ObjectsDataSet",
        // Here we add a Dataset per entity Type
        "EntityTypeNameObjectsDataSet": {
            "EntityTypeNameObjectsObjects": {
                IdCounter: { // Each object has a unique Id
                    // All entity properties go here.
                    // + 3 specific properties
                    "IsDirty": true, //marks changes
                    "IsNew": true/false, // ADD/MODIFY
                    "IsMarkedForDeletion": true/false // DELETE/NOT DELETE
                },
                IdCounter++: {
                    ...
                ,
                IdCounter++++: {
                    ...
                }
            }
        }
    }
}
```

### addEntitiesToDataset

`addEntitiesToDataset(resourceName, entities, dataset)` can be called on an existing dataset, created by the `buildDataset` function.
It will add the `entities` array (representing a set of entities of type `resourceName` to the given `dataset`).

### createEmptyDataset

`createEmptyDataset()` is used internally by `buildDataset` to initialize an empty dataset.

### buildPrimaryKey

`buildPrimaryKey(entity, ...keyNames)` is used internally by `buildDataset` to initialize the _PrimaryKey_ attribute of the main dataset.

## Fetching data from server

### cleanResultFromRefMentions

`cleanResultFromRefMentions(data, linksToCheck)` can be called on a result JSON object, returned from the back-end, and is used to remove any "empty" reference to `$ref` object.
Indeed, the data returned from the server is presented like this:

```
[
    {
        $id: 1,
        $type:"ContractDataObject",
        Amount: 0,
        Customer: {
            $id: 2,
            Id: "38f02943-b04f-4327-8b28-329016a3d510",
            FirstName: "John",
            LastName: "Doe"
        },
        CustomerId: "38f02943-b04f-4327-8b28-329016a3d510",
        Id: "ebc2bd8b-5f9d-4ece-a733-0d9dc53183e6"
    },
    {
        $id: 3,
        $type:"ContractDataObject",
        Amount: 10,
        Customer: {
            $ref: 2
        },
        CustomerId: "38f02943-b04f-4327-8b28-329016a3d510",
        Id: "e6b071b8-f3c8-41dd-b2ea-363085c115e7"
    },
    {
        $id: 4,
        $type:"ContractDataObject",
        Amount: 5,
        Customer: {
            $ref: 2
        },
        CustomerId: "38f02943-b04f-4327-8b28-329016a3d510",
        Id: "e5f2b798-d5d7-49a6-80f3-6441947d463e"
    }
]
```

making the "empty" `Customer` link (using the REST `$ref` annotation) being interpreted by our ORM Library as a object to create.
In order to make it insert correctly only real data, we need to send:

```
[
    {
        $id: 1,
        $type:"ContractDataObject",
        Amount: 0,
        Customer: {
            $id: 2,
            Id: "38f02943-b04f-4327-8b28-329016a3d510",
            FirstName: "John",
            LastName: "Doe"
        },
        CustomerId: "38f02943-b04f-4327-8b28-329016a3d510",
        Id: "ebc2bd8b-5f9d-4ece-a733-0d9dc53183e6"
    },
    {
        $id: 3,
        $type:"ContractDataObject",
        Amount: 10,
        Customer: null,
        CustomerId: "38f02943-b04f-4327-8b28-329016a3d510",
        Id: "e6b071b8-f3c8-41dd-b2ea-363085c115e7"
    },
    {
        $id: 4,
        $type:"ContractDataObject",
        Amount: 5,
        Customer: null,
        CustomerId: "38f02943-b04f-4327-8b28-329016a3d510",
        Id: "e5f2b798-d5d7-49a6-80f3-6441947d463e"
    }
]
```

(we transformed the Customer objects to null references when redundant).

The `cleanResultFromRefMentions` does just that.
