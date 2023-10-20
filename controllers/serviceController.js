const models = require("../models");
const CryptoJS = require("crypto-js");


const createEquipmentCard = async(req, res) => {
    try{
        console.log(req.body, 'Req body')
        const createdEquipmentCard = await models.equipment_cards.create(req.body)

        const id = createdEquipmentCard.id
        console.log(id, 'EC ID')

        res.status(200).json({ message: 'Equipment Card created successfully', data: id });

    } catch (error) {
        console.error('Error creating equipment card:', error);
        console.log(error, 'ERROR')
        res.status(500).json({ error: 'Please fill out all required data' });
    }

}

const getECDataByECID = async (req, res, next) => {
    const ec_id = req.params.id; // Assuming you have a route parameter for po_id
    console.log(ec_id, 'Ec_ID');

    try {
        // Fetch the specific purchase order based on id and include vendor and warehouse details
        const equipmentCard = await models.equipment_cards.findOne({
            where: {
                id: ec_id,
            },
            include: [
                {
                    model: models.customers,
                    // as: 'vendors', // Alias for the included vendor details
                },
                {
                    model: models.users,
                },
                {
                    model: models.inventory_items
                }
            ],
        });

        if (!equipmentCard) {
            return res.status(404).json({ message: 'Equipment Card not found' });
        }

        res.status(200).send({
            message: 'Equipment Card have been fetched successfully',
            equipmentCard,
        });
        console.log('Data pushed to front');
    } catch (error) {
        res.status(500).json({ message: 'Error fetching Equipment Card' });
        console.error(error, 'ERROR');
    }
};
const updateEquipmentCard = async(req, res, next) => {
    try {
        const data = req.body;
        console.log('***REQUEST BODY****', data);

        const options = {
            where: {
                id: data.id,
                tenant_id: data.tenant_id
            },
        }
        const equipmentCard = await models.equipment_cards.findOne(options)


        const updateCustomer = await equipmentCard.update(data);
        res.status(200).send({message: 'Equipment Card updated successfully', success: true})
        console.log('Equipment Card has been updated')

    } catch (error) {
        res.status(500).send({message: 'Error updating equipment card', success: false, error});
        console.log('***ERROR***', error)
    }
}

module.exports = {
    createEquipmentCard,
    getECDataByECID,
    updateEquipmentCard
}