require('dotenv').config();
const express = require('express');
const { Sequelize, DataTypes } = require('sequelize');

const app = express();
app.use(express.json());

// MySQL connection
const sequelize = new Sequelize(process.env.MYSQL_URL, {
  dialect: 'mysql',
  logging: false,
});

// Définir le modèle License
const License = sequelize.define('License', {
  licenseKey: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  machineId: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
});

sequelize.authenticate()
  .then(() => console.log('Connection has been established successfully.'))
  .catch(error => console.error('Unable to connect to the database:', error));

// Synchroniser les modèles avec la base de données
sequelize.sync()
  .then(() => console.log('Database synchronized'))
  .catch(error => console.error('Error synchronizing database:', error));

// Route to validate a license
app.post('/LSCCUSTOMROUND', async (req, res) => {
  const { licenseKey, machineId } = req.body;

  try {
    // Rechercher la licence dans la base de données
    const license = await License.findOne({ where: { licenseKey } });

    // Si la licence n'est pas trouvée
    if (!license) {
      return res.status(404).json({ message: 'License not found' });
    }

    // Si la licence est active mais utilisée par une autre machine
    if (license.isActive && license.machineId !== machineId) {
      return res.status(400).json({ message: 'License already used on another machine' });
    }

    // Si la licence n'est pas encore active
    if (!license.isActive) {
      license.machineId = machineId;  // Assigner la machine actuelle
      license.isActive = true;        // Activer la licence
      await license.save();
      return res.status(200).json({ message: 'License activated and assigned to this machine' });
    }

    // Si la licence est déjà active et utilisée par cette machine
    return res.status(200).json({ message: 'License is valid and already assigned to this machine' });
  } catch (error) {
    console.error('Error validating license:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
