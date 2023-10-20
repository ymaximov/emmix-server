const models = require("../models");


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

module.exports = {
    createEquipmentCard
}