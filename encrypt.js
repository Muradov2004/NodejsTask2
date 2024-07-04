const bcrypt = require("bcrypt");
const EventEmitter = require("events");
const emitter = new EventEmitter();
const saltRounds = 10;

const encryptString = async (myPlaintextPassword) => {
  try {
    const hash = await bcrypt.hash(myPlaintextPassword, saltRounds);
    return hash;
  } catch (err) {
    emitter.emit("logError", err.message);
    throw err; 
  }
};

const compareString = async (myPlaintextPassword, hash) => {
  try {
    const result = await bcrypt.compare(myPlaintextPassword, hash);
    return result;
  } catch (err) {
    emitter.emit("logError", err.message);
    throw err;
  }
};

module.exports = {
  encryptString,
  compareString,
};
