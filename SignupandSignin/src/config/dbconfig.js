const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(
  "apr_db",  //DB name
  "apr_db_user", //DB user name
  "dCEwGaXRGZ2wYhnOPfA4XY011sbPqR8c", //DB password
  {
    host: "dpg-cjiabevjbvhs73dhsv0g-a.singapore-postgres.render.com", //External host
    dialect: "postgres",
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false, // Accept self-signed certificates
      },
    },
  }
);

const testDb = async () => {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};
testDb();


module.exports = { sequelize };
