/*  This method creates a specific dataset for the GO Server
    The payload must match the following structure:
    {
        "InternalObjectId": Arbitrary number (set to 1 in our code),
        "PrimaryKey": The PK of our main entity,
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
*/
export function buildPrimaryKey(entity, ...keyNames) {
    var primaryKey;

    if (!entity || typeof entity != 'object')
        throw new Error('buildPrimaryKey takes an entity object as first parameter');

    if (keyNames.length == 0)
        throw new Error('buildPrimaryKey takes at least one key name as second parameter');

    if (keyNames.length == 1) {
        primaryKey = entity[keyNames];
    } else {
        primaryKey = {};
        keyNames.forEach(name => {
            primaryKey[name] = entity[name];
        });
    }
    return primaryKey;
};

export function createEmptyDataset() {
    return {
        InternalObjectId: 0,
        ObjectsDataSet: {
            "$type": "ObjectsDataSet"
        }
    }
}

export function buildDataset(resourceName, entities, ...pkFields) {
    // Prepare Dataset
    let dataset = createEmptyDataset();

    if (entities && entities.length > 0) {

        if (!pkFields || pkFields.length == 0)
            throw new Error('You must specify the PK field(s) for the main entity');

        // Prepare Primary Key
        dataset.PrimaryKey = buildPrimaryKey(entities[0], pkFields);

        // Creating the dataset inline
        // Only works for Update & Delete, not Create
        addEntitiesToDataset(resourceName, entities, dataset);
    }

    return dataset;
};

export function addEntitiesToDataset(resourceName, entities, dataset) {
    if (!resourceName)
        throw new Error('You must specify the resourceName to use for this dataset ("main entity")');

    if (!dataset)
        throw new Error('You must specify the dataset to add entities to');

    let lastInternalObjectId = dataset.InternalObjectId;
    let currentLastObjectId = lastInternalObjectId;

    if (!(resourceName + "ObjectsDataSet" in dataset.ObjectsDataSet)) {
        dataset.ObjectsDataSet[resourceName + "ObjectsDataSet"] = {};
        dataset.ObjectsDataSet[resourceName + "ObjectsDataSet"][resourceName + "Objects"] = {};
    }

    entities.forEach((entity, i) => {
        dataset.ObjectsDataSet[resourceName + "ObjectsDataSet"][resourceName + "Objects"][i + 1 + lastInternalObjectId] = entity;
        currentLastObjectId = i + lastInternalObjectId + 1;
    });

    dataset.InternalObjectId = currentLastObjectId;
    return dataset;
}

