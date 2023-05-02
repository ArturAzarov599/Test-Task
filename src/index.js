/**
 * This class is just a facade for your implementation, the tests below are using the `World` class only.
 * Feel free to add the data and behavior, but don't change the public interface.
 */

export class World {
  constructor() {
    this.adjacencyList = {};
  }

  #powerPlantPrefix = "PP-";
  #householdPrefix = "HH-";
  #killedPowerPlantPrefix = "KPP-";

  #getRandomNumber() {
    return Math.ceil(Math.random() * 1000000);
  }

  createPowerPlant() {
    let powerPlantNameWithPrefix = this.#powerPlantPrefix + this.#getRandomNumber();
    if (this.adjacencyList[powerPlantNameWithPrefix]) {
      console.log(`Power plant already existed`);
      return false;
    }

    this.adjacencyList[powerPlantNameWithPrefix] = [];
    return powerPlantNameWithPrefix.substring(3);
  }

  createHousehold() {
    let householdNameWithPrefix = this.#householdPrefix + this.#getRandomNumber();
    if (this.adjacencyList[householdNameWithPrefix]) {
      console.log(`Household already existed`);
      return false;
    }

    this.adjacencyList[householdNameWithPrefix] = [];
    return householdNameWithPrefix.substring(3);
  }

  #getEntity(entityName, entityPrefix) {
    let entityNameWithPrefix = entityPrefix + entityName;
    let entityCollection = this.adjacencyList[entityNameWithPrefix];

    if (entityCollection) {
      return {
        entityName: entityNameWithPrefix,
        collection: entityCollection,
      };
    }

    return false;
  }

  connectHouseholdToPowerPlant(householdName, powerPlantName) {
    let powerPlantEntity = this.#getEntity(
      powerPlantName,
      this.#powerPlantPrefix
    );
    let houseHoldEntity = this.#getEntity(householdName, this.#householdPrefix);

    if (houseHoldEntity && powerPlantEntity) {
      let isAlreadyConnected = houseHoldEntity.collection.find(
        (connection) => connection === powerPlantEntity.entityName
      );

      if (isAlreadyConnected) {
        console.log(`Household already connected to Power plant!`);
        return false;
      }
      this.adjacencyList[powerPlantEntity.entityName].push(
        houseHoldEntity.entityName
      );
      this.adjacencyList[houseHoldEntity.entityName].push(
        powerPlantEntity.entityName
      );
      return true;
    }

    if (!houseHoldEntity)
      console.log(`Can't find household with this name: ${householdName}`);

    if (!powerPlantEntity)
      console.log(`Can't find power plant with this name: ${powerPlantName}`);

    return false;
  }

  connectHouseholdToHousehold(householdName1, householdName2) {
    let household1Entity = this.#getEntity(
      householdName1,
      this.#householdPrefix
    );
    let household2Entity = this.#getEntity(
      householdName2,
      this.#householdPrefix
    );

    if (household1Entity && household2Entity) {
      let isAlreadyConnected = household1Entity.collection.find(
        (connection) => connection === household2Entity.entityName
      );

      if (isAlreadyConnected) {
        console.log(`Households already connected to each other!`);
        return false;
      }

      this.adjacencyList[household1Entity.entityName].push(
        household2Entity.entityName
      );
      this.adjacencyList[household2Entity.entityName].push(
        household1Entity.entityName
      );
      return true;
    }

    if (!household1Entity)
      console.log(`Can't find household with this name: ${householdName1}`);

    if (!household2Entity)
      console.log(`Can't find household with this name: ${householdName2}`);

    return false;
  }

  disconnectHouseholdFromPowerPlant(householdName, powerPlantName) {
    let householdEntity = this.#getEntity(householdName, this.#householdPrefix);
    let powerPlantEntity = this.#getEntity(
      powerPlantName,
      this.#powerPlantPrefix
    );

    if (householdEntity && powerPlantEntity) {
      let isAlreadyDisconnected = !powerPlantEntity.collection.find(
        (item) => item === householdEntity.entityName
      );

      if (isAlreadyDisconnected) {
        console.log(`Items already disconnected`);
        return false;
      }

      this.adjacencyList[powerPlantEntity.entityName] = this.adjacencyList[
        powerPlantEntity.entityName
      ].filter((v) => v !== householdEntity.entityName);

      this.adjacencyList[householdEntity.entityName] = this.adjacencyList[
        householdEntity.entityName
      ].filter((v) => v !== powerPlantEntity.entityName);

      return true;
    }

    if (!householdEntity)
      console.log(`Can't find household with this name: ${householdName}`);

    if (!powerPlantEntity)
      console.log(`Can't find power plant with this name: ${powerPlantName}`);

    return false;
  }

  #updateHouseholdPowerPlant(
    householdName,
    newPowerPlantName,
    oldPowerPlantName
  ) {
    this.adjacencyList[householdName] = this.adjacencyList[
      householdName
    ].filter((i) => i !== oldPowerPlantName);
    this.adjacencyList[householdName] = [
      ...this.adjacencyList[householdName],
      newPowerPlantName,
    ];

    return true;
  }

  killPowerPlant(powerPlantName) {
    let powerPlantEntity = this.#getEntity(
      powerPlantName,
      this.#powerPlantPrefix
    );

    if (powerPlantEntity) {
      let killedPowerPlantEntityName =
        this.#killedPowerPlantPrefix + powerPlantName;
      this.adjacencyList[killedPowerPlantEntityName] =
        powerPlantEntity.collection;
      powerPlantEntity.collection.map((item) =>
        this.#updateHouseholdPowerPlant(
          item,
          killedPowerPlantEntityName,
          powerPlantEntity.entityName
        )
      );
      delete this.adjacencyList[powerPlantEntity.entityName];
      return true;
    }

    console.log(`Power plant don't exist!`);
    return false;
  }

  repairPowerPlant(powerPlantName) {
    let killedPowerPlantEntity = this.#getEntity(
      powerPlantName,
      this.#killedPowerPlantPrefix
    );

    if (killedPowerPlantEntity) {
      let repairedPowerPlantEntityName =
        this.#powerPlantPrefix + powerPlantName;
      this.adjacencyList[repairedPowerPlantEntityName] =
        killedPowerPlantEntity.collection;
      killedPowerPlantEntity.collection.map((item) =>
        this.#updateHouseholdPowerPlant(
          item,
          repairedPowerPlantEntityName,
          killedPowerPlantEntity.entityName
        )
      );
      delete this.adjacencyList[killedPowerPlantEntity.entityName];
      return true;
    }

    console.log(`Can't find killed power plant with name: ${powerPlantName}`);
    return false;
  }

  householdHasElectricity(household) {
    let householdEntity = this.#getEntity(household, this.#householdPrefix);

    if (!householdEntity) {
      console.log(`Can't find household with name: ${household}`);
      return false;
    }

    let isHouseholdHaveElectricity = householdEntity.collection.find((item) =>
      item.startsWith(this.#powerPlantPrefix)
    );

    if (isHouseholdHaveElectricity) {
      console.log(`Household has electricity!`);
      return true;
    }

    let filteredArray = householdEntity.collection.filter((item) =>
      item.startsWith(this.#householdPrefix)
    );

    const result = filteredArray.flatMap(item => this.adjacencyList[item].filter(item => item.startsWith(this.#powerPlantPrefix)));

    if (result.length) {
      console.log(`Household has electricity!`);
      return true;
    }

    console.log(`Household doesn't have electricity`);
    return false;
  }
}
