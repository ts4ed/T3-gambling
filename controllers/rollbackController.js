const { Deposit } = require("../db/depositModel");
const { User } = require("../db/userModel");
const { rollback } = require("../services/rollbackService");

const rollbackController = async (req, res) => {
  const { deposit_id } = req.body;
  const { _id: userId } = req.user;
  const { "x-token": tokenH } = req.headers;
  const findUser = await User.findOne({ _id: userId });

  if (tokenH !== findUser.token) {
    return res.status(401).json({
      message: "unauthorized",
      description: "Not successful, invalid token",
    });
  }

  if (!(await Deposit.findOne({ deposit_id: deposit_id }))) {
    return res.status(400).json({
      message: "unknown",
      description: "Not successful, invalid deposit",
    });
  }
  if (!findUser) {
    return res.status(400).json({
      message: "error",
      description: "Not successful, unknown error",
    });
  }

  const deposit = await rollback(deposit_id, userId);

  res.json({
    deposit: deposit,
    message: "success",
    description: "success",
  });
};

module.exports = {
  rollbackController,
};
