const models = require('../models')

async function insertItemGroup() {
    const newItemGroupData = {
        tenant_id: '15',
        name: 'Electronics category',
    };

    try {
        const itemGroup = await models.item_groups.create(newItemGroupData);
        console.log('Inserted item group:', itemGroup.toJSON());
    } catch (error) {
        console.error('Error inserting item group:', error);
    }
}

// Call the function to insert an item group
insertItemGroup();