# GO Dataset Builder library

This library exposes several method to convert POJO (_Plain Old JavaScript Objects_) to Generative Objects dataset format. These are meant to be use when sending data to the server (for save). Here are the exposed methods:

## buildDataset

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

## addEntitiesToDataset

`addEntitiesToDataset(resourceName, entities, dataset)` can be called on an existing dataset, created by the `buildDataset` function.
It will add the `entities` array (representing a set of entities of type `resourceName` to the given `dataset`).

## createEmptyDataset

`createEmptyDataset()` is used internally by `buildDataset` to initialize an empty dataset.

## buildPrimaryKey

`buildPrimaryKey(entity, ...keyNames)` is used internally by `buildDataset` to initialize the _PrimaryKey_ attribute of the main dataset.
