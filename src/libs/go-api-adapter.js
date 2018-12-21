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

/**
 * Builds a GO-compatible dataset from the provided list of entities
 * @param {Array} entities Array of { name: String, data: Object, pkFields: Array }
 */
export function buildDataset(entities) {
    // Prepare Dataset
    let dataset = createEmptyDataset();

    if (entities && entities.length > 0) {
        let pkFields = entities[0].pkFields;

        if (!pkFields || pkFields.length == 0)
            throw new Error(
                'You must specify the PK field(s) for the first entity'
            );

        // Creating the dataset inline
        entities.forEach((elt, i) => {
            if (!elt.name)
                throw new Error(
                    'You must specify the Entity Name for each entity'
                );
            addEntitiesToDataset(elt.name, [elt.data], dataset);
        });

        // Set primary key accordingly
        dataset.PrimaryKey = buildPrimaryKey(entities[0].data, pkFields);
    }

    delete dataset.lastInternalObjectId;
    return dataset;
}

function buildPrimaryKey(entity, keyNames) {
    let primaryKey;

    if (keyNames.length == 1) {
        primaryKey = entity[keyNames];
    } else {
        primaryKey = {};
        keyNames.forEach(name => {
            primaryKey[name] = entity[name];
        });
    }
    return primaryKey;
}

function createEmptyDataset() {
    return {
        InternalObjectId: 1,
        ObjectsDataSet: {
            $type: 'ObjectsDataSet'
        }
    };
}

function addEntitiesToDataset(resourceName, entities, dataset) {
    let lastInternalObjectId = dataset.lastInternalObjectId || 0;
    let currentLastObjectId = lastInternalObjectId;

    if (!(resourceName + 'ObjectsDataSet' in dataset.ObjectsDataSet)) {
        dataset.ObjectsDataSet[resourceName + 'ObjectsDataSet'] = {};
        dataset.ObjectsDataSet[resourceName + 'ObjectsDataSet'][
            resourceName + 'Objects'
        ] = {};
    }

    entities.forEach((entity, i) => {
        dataset.ObjectsDataSet[resourceName + 'ObjectsDataSet'][
            resourceName + 'Objects'
        ][i + 1 + lastInternalObjectId] = entity;
        currentLastObjectId = i + lastInternalObjectId + 1;
    });

    dataset.lastInternalObjectId = currentLastObjectId;
    return dataset;
}

// API Cleaner

export function cleanResultFromRefMentions(data, linksToCheck) {
    if (data instanceof Array) {
        return removeRefFromArray(data, linksToCheck);
    } else if (data instanceof Object) {
        return removeRefFromObject(data, linksToCheck);
    } else return data;
}

function removeRefFromArray(objectList, linksToCheck) {
    let toReturn = [];
    objectList.forEach(elt => {
        var result = cleanResultFromRefMentions(elt, linksToCheck);
        if (result != null) {
            toReturn.push(result);
        }
    });
    return toReturn;
}

function removeRefFromObject(elt, linksToCheck) {
    let allKeys = Object.keys(elt);

    // If current object is an 'almost empty object'
    // (with only the $ref attribute set)
    // Then we return a "null" relation to be ignored
    if (allKeys.length === 1 && elt.hasOwnProperty('$ref')) {
        return null;
    }

    // Else, we browse the eventual relation "fields"
    Object.keys(elt).forEach(key => {
        // Checking if current key is a relation field in the list to check
        if (linksToCheck.indexOf(key) > -1) {
            let newList = removeReferenceFromIncludeList(linksToCheck, key);
            elt[key] = cleanResultFromRefMentions(elt[key], newList);
        }
        // else, might be an indirect inclusion (e.g. "Customer.Address")
        else if (
            linksToCheck.find(link => link.indexOf(key) > -1) !== undefined
        ) {
            let newList = removeReferenceFromIncludeList(linksToCheck, key);
            elt[key] = cleanResultFromRefMentions(elt[key], newList);
        }
    });

    return elt;
}

function removeReferenceFromIncludeList(initialList, keyToRemove) {
    return initialList
        .map(includeName => {
            if (includeName === keyToRemove) {
                return null;
            } else if (includeName.indexOf(keyToRemove) > -1) {
                return includeName.replace(keyToRemove + '.', '');
            } else return includeName;
        })
        .filter(x => x !== null);
}
