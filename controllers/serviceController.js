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

const createRepairOrder = async (req, res) => {
    try {
        console.log(req.body, 'Req body');

        // Get the 'equipment_id,' 'customer_id,' and 'tenant_id' from the request body
        const { equipment_id, customer_id, tenant_id, iser_id } = req.body;

        // Find the equipment card
        const equipmentCard = await models.equipment_cards.findOne({
            where: { id: equipment_id },
            attributes: ['customer_id', 'tenant_id'],
        });

        if (!equipmentCard) {
            return res.status(404).json({ error: 'Equipment not found' });
        }

        const { customer_id: equipmentCustomerID, tenant_id: equipmentTenantID } = equipmentCard;

        // Verify if 'equipment_id' belongs to the same 'customer_id' and 'tenant_id'
        if (equipmentCustomerID !== customer_id || equipmentTenantID !== tenant_id) {
            return res.status(403).json({ error: 'Equipment does not belong to the specified customer and tenant' });
        }

        // Create the repair order
        const createdRepairOrder = await models.repair_orders.create(req.body);
        const id = createdRepairOrder.id;

        console.log(id, 'RO ID');
        res.status(200).json({ message: 'Repair Order created successfully', data: id });
    } catch (error) {
        console.error('Error creating repair order', error);
        console.log(error, 'ERROR');
        res.status(500).json({ error: 'Please fill out all required data' });
    }
};

const createRepairOrderActivity = async (req, res) => {
    try {
        console.log(req.body, 'REQ BODY!!')
        const createdRepairOrderActivity = await models.repair_order_activities.create(req.body);

        const id = createdRepairOrderActivity.id;
        console.log(id, 'Repair Order Activity ID');

        res.status(200).json({ message: 'Repair Order Activity created successfully', data: id });
    } catch (error) {
        console.error('Error creating repair order activity:', error);
        res.status(500).json({ error: 'An error occurred while creating the repair order activity' });
    }
}

// Make the 'createRepairOrderActivity' function available for use in your routes
module.exports = { createRepairOrderActivity };

const  createServiceContract = async(req, res) => {
    try{
        console.log(req.body, 'Req body')
        const createdServiceContract = await models.service_contracts.create(req.body)

        const id = createdServiceContract.id
        console.log(id, 'EC ID')

        res.status(200).json({ message: 'Service Contract created successfully', data: id, success: true });

    } catch (error) {
        console.error('Error creating service contract:', error);
        console.log(error, 'ERROR')
        res.status(500).json({ error: 'Please fill out all required data' });
    }

}

const getECDataByECID = async (req, res, next) => {
    const ec_id = req.params.id; // Assuming you have a route parameter for ec_id
    console.log(ec_id, 'ec_ID');
    console.log(req.params, 'req params');

    try {
        // Fetch the specific equipment card based on id and include vendor and warehouse details
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
                    model: models.inventory_items,
                },
            ],
        });

        if (!equipmentCard) {
            return res.status(404).json({ message: 'Equipment Card not found' });
        }

        let technician = null;
        // Check if the technician_id is not null before fetching technician data
        if (equipmentCard.technician_id !== null) {
            technician = await models.users.findOne({
                where: {
                    id: equipmentCard.technician_id, // Assuming 'technician_id' is the foreign key in equipment_cards
                },
            });

            if (!technician) {
                return res.status(404).json({ message: 'Technician not found' });
            }
        }

        // Combine equipmentCard and technician data
        const responseData = {
            message: 'Equipment Card has been fetched successfully',
            equipmentCard: equipmentCard,
            technician: technician,
        };

        res.status(200).json(responseData);
        console.log('Data pushed to front');
    } catch (error) {
        res.status(500).json({ message: 'Error fetching Equipment Card' });
        console.error(error, 'ERROR');
    }
};

const getSCDataBySCID = async (req, res, next) => {
    const sc_id = req.params.id; // Assuming you have a route parameter for ec_id
    console.log(sc_id, 'ec_ID');
    console.log(req.params, 'req params');

    try {
        // Fetch the specific equipment card based on id and include vendor and warehouse details
        const serviceContract = await models.service_contracts.findOne({
            where: {
                id: sc_id,
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
                    model: models.equipment_cards,
                    include: [
                        {
                            model: models.inventory_items, // Include the inventory_items relation within equipment_cards
                        },
                    ],
                },
            ],
        });

        if (!serviceContract) {
            return res.status(404).json({ message: 'Service Contract not found' });
        }


        // Combine equipmentCard and technician data
        const responseData = {
            message: 'Service Contract has been fetched successfully',
            serviceContract: serviceContract,
        };

        res.status(200).json(responseData);
        console.log('Data pushed to front');
    } catch (error) {
        res.status(500).json({ message: 'Error fetching Equipment Card' });
        console.error(error, 'ERROR');
    }
};
const getRODataByROID = async (req, res, next) => {
    const ro_id = req.params.id; // Assuming you have a route parameter for ro_id
    console.log(ro_id, 'RO_ID');
    console.log(req.params, 'req params');

    try {
        // Fetch the specific repair order based on id and include customer and user details
        const repairOrder = await models.repair_orders.findOne({
            where: {
                id: ro_id,
            },
            include: [
                {
                    model: models.customers,
                },
                {
                    model: models.users,
                },
                {
                    model: models.equipment_cards,
                    include: [
                        {
                            model: models.inventory_items, // Include the inventory_items relation within equipment_cards
                        },
                    ],
                },
            ],
        });

        if (!repairOrder) {
            return res.status(404).json({ message: 'Repair order not found' });
        }

        // Search for relevant service contracts and include user data
        const contractData = await models.service_contracts.findOne({
            where: {
                contract_type: 'repair', // Your enum value for repair
                tenant_id: repairOrder.tenant_id,
                status: 'open', // Your enum value for open
                equipment_id: repairOrder.equipment_id,
                customer_id: repairOrder.customer_id
            },
            include: [
                {
                    model: models.users, // Include the user data
                    as: 'user', // You can use 'as' if there's an alias for this association
                },
            ],
        });

        // Combine equipmentCard, technician, and contract data
        const responseData = {
            message: 'Repair Order has been fetched successfully',
            repairOrder,
            contractData, // Sending the contract data along with the repair order data
        };

        res.status(200).json(responseData);
        console.log('Data pushed to the front');
    } catch (error) {
        res.status(500).json({ message: 'Error fetching Repair Order' });
        console.error(error, 'ERROR');
    }
};

// const getRODataByROID = async (req, res, next) => {
//     const ro_id = req.params.id; // Assuming you have a route parameter for ro_id
//     console.log(ro_id, 'RO_ID');
//     console.log(req.params, 'req params');
//
//     try {
//         // Fetch the specific repair order based on id and include customer and user details
//         const repairOrder = await models.repair_orders.findOne({
//             where: {
//                 id: ro_id,
//             },
//             include: [
//                 {
//                     model: models.customers,
//                 },
//                 {
//                     model: models.users,
//                 },
//                 {
//                     model: models.equipment_cards,
//                     include: [
//                         {
//                             model: models.inventory_items, // Include the inventory_items relation within equipment_cards
//                         },
//                     ],
//                 },
//             ],
//         });
//
//         if (!repairOrder) {
//             return res.status(404).json({ message: 'Repair order not found' });
//         }
//
//         // Search for relevant service contracts
//         const contractData = await models.service_contracts.findOne({
//             where: {
//                 contract_type: 'repair', // Your enum value for repair
//                 tenant_id: repairOrder.tenant_id,
//                 status: 'open', // Your enum value for open
//                 equipment_id: repairOrder.equipment_id,
//                 customer_id: repairOrder.customer_id
//             },
//         });
//
//         // Combine equipmentCard, technician, and contract data
//         const responseData = {
//             message: 'Repair Order has been fetched successfully',
//             repairOrder,
//             contractData, // Sending the contract data along with the repair order data
//         };
//
//         res.status(200).json(responseData);
//         console.log('Data pushed to the front');
//     } catch (error) {
//         res.status(500).json({ message: 'Error fetching Repair Order' });
//         console.error(error, 'ERROR');
//     }
// };



const updateEquipmentCard = async (req, res, next) => {
    try {
        const data = req.body;
        console.log('***REQUEST BODY****', data);

        const options = {
            where: {
                id: data.id,
                tenant_id: data.tenant_id,
            },
        };
        const equipmentCard = await models.equipment_cards.findOne(options);

        if (!equipmentCard) {
            return res.status(404).send({ message: 'Equipment Card not found', success: false });
        }

        // Check if the inv_item_id, technician_id, and delivery_id are associated with the same tenant_id
        const inventoryItem = await models.inventory_items.findOne({
            where: {
                id: data.inv_item_id,
                tenant_id: data.tenant_id
            }
        });

        const technician = await models.users.findOne({
            where: {
                id: data.technician_id,
                tenant_id: data.tenant_id,
                technician: true
            }
        });

        const delivery = await models.deliveries.findOne({
            where: {
                id: data.delivery_id,
                tenant_id: data.tenant_id
            }
        });

        if (
            (!inventoryItem && data.inv_item_id !== null) ||
            (!technician && data.technician_id !== null) ||
            (!delivery && data.delivery_id !== null)
        ) {
            return res.status(403).send({ message: 'Invalid inv_item_id, technician_id, delivery_id, or tenant_id', success: false });
        }

        const updateData = {
            status: data.status,
            mfr_serial: data.mfr_serial,
            serial_no: data.serial_no,
            delivery_id: data.delivery_id,
            inv_item_id: data.inv_item_id,
            technician_id: data.technician_id,
        };

        const updateCustomer = await equipmentCard.update(updateData);
        res.status(200).send({ message: 'Equipment Card updated successfully', success: true });
        console.log('Equipment Card has been updated');
    } catch (error) {
        res.status(500).send({ message: 'Error updating equipment card', success: false, error });
        console.error('***ERROR***', error);
    }
};

const updateServiceContract = async (req, res, next) => {
    try {
        const data = req.body;
        console.log('***REQUEST BODY****', data);

        const options = {
            where: {
                id: data.id,
                tenant_id: data.tenant_id,
            },
        };
        const serviceContract = await models.service_contracts.findOne(options);

        if (!serviceContract) {
            return res.status(404).send({ message: 'Service Contract not found', success: false });
        }

        // Initialize the updateData object with common properties
        const updateData = {
            status: data.status,
            description: data.description,
            remarks: data.remarks,
            response_time: data.response_time,
            response_time_type: data.response_time_type,
            resolution_time: data.resolution_time,
            resolution_time_type: data.resolution_time_type,
            technician_id: data.technician_id
        };

        // Check if equipment_id is provided and not null or undefined
        if (data.equipment_id !== null && data.equipment_id !== undefined) {
            const equipment = await models.equipment_cards.findOne({
                where: {
                    id: data.equipment_id,
                    tenant_id: data.tenant_id,
                },
            });

            if (!equipment) {
                return res.status(403).send({ message: 'Invalid equipment id', success: false });
            }

            // If equipment_id is valid, add it to the updateData object
            updateData.equipment_id = data.equipment_id;
        }

        const updateCustomer = await serviceContract.update(updateData);
        res.status(200).send({ message: 'Service Contract updated successfully', success: true });
    } catch (error) {
        res.status(500).send({ message: 'Error updating service contract', success: false, error });
        console.error('***ERROR***', error);
    }
};

const updateRepairOrder = async (req, res, next) => {
    console.log(req.body, 'REQ BODY!!!')
    try {
        const data = req.body;
        console.log('***REQUEST BODY****', data);

        const options = {
            where: {
                id: data.id,
                tenant_id: data.tenant_id,
            },
        };
        const repairOrder = await models.repair_orders.findOne(options);

        if (!repairOrder) {
            return res.status(404).send({ message: 'Repair Order not found', success: false });
        }

        // Check if the technician_id exists in the users table for the same tenant
        if (data.technician_id) {
            const technician = await models.users.findOne({
                where: {
                    id: data.technician_id,
                    tenant_id: data.tenant_id,
                    technician: true
                },
            });

            if (!technician) {
                return res.status(403).send({ message: 'Invalid technician_id', success: false });
            }
        }

        // Initialize the updateData object with common properties
        const updateData = {
            status: data.status,
            description: data.description,
            repair_description: data.repair_description,
            resolution_description: data.resolution_description,
            technician_id: data.technician_id,
            contact_person: data.contact_person,
            phone_1: data.phone_1,
            mobile_phone: data.mobile_phone,
            email: data.email,
        };

        const updateRepairOrder = await repairOrder.update(updateData);
        res.status(200).send({ message: 'Repair Order updated successfully', success: true });
    } catch (error) {
        res.status(500).send({ message: 'Error updating repair order', success: false, error });
        console.error('***ERROR***', error);
    }
};



// const updateEquipmentCard = async (req, res, next) => {
//     try {
//         const data = req.body;
//         console.log('***REQUEST BODY****', data);
//
//         const options = {
//             where: {
//                 id: data.id,
//                 tenant_id: data.tenant_id
//             },
//         }
//         const equipmentCard = await models.equipment_cards.findOne(options)
//
//         if (!equipmentCard) {
//             return res.status(404).send({ message: 'Equipment Card not found', success: false });
//         }
//
//         // Check if the inv_item_id, technician_id, and delivery_id are associated with the same tenant_id
//         const inventoryItem = await models.inventory_items.findOne({
//             where: {
//                 id: data.inv_item_id,
//                 tenant_id: data.tenant_id
//             }
//         });
//
//         const technician = await models.users.findOne({
//             where: {
//                 id: data.technician_id,
//                 tenant_id: data.tenant_id
//             }
//         });
//
//         const delivery = await models.deliveries.findOne({
//             where: {
//                 id: data.delivery_id,
//                 tenant_id: data.tenant_id
//             }
//         });
//
//         if (!inventoryItem || !technician || !delivery) {
//             return res.status(403).send({ message: 'Invalid inv_item_id, technician_id, or delivery_id', success: false });
//         }
//
//         const updateCustomer = await equipmentCard.update(data);
//         res.status(200).send({ message: 'Equipment Card updated successfully', success: true });
//         console.log('Equipment Card has been updated');
//
//     } catch (error) {
//         res.status(500).send({ message: 'Error updating equipment card', success: false, error });
//         console.log('***ERROR***', error);
//     }
// };



module.exports = {
    createEquipmentCard,
    getECDataByECID,
    updateEquipmentCard,
    createServiceContract,
    getSCDataBySCID,
    updateServiceContract,
    createRepairOrder,
    getRODataByROID,
    updateRepairOrder,
    createRepairOrderActivity
}