const User = require("../models/user.model");
const {
  HttpResponse,
  HttpResponseError,
} = require("../utils/Response/http.response");
const { HttpStatus } = require("../constants/app.constant");
const jwt = require("jsonwebtoken");
const _CONF = require("../config/app");

module.exports.getAll = async (req, res) => {
  try {
    let users = await User.find({}).populate("convs").populate("grs").exec();

    if (users.length) return HttpResponse(res, HttpStatus.OK, users);

    return HttpResponse(res, HttpStatus.NO_CONTENT);
  } catch (err) {
    return HttpResponseError(res, HttpStatus.INTERNAL_SERVER_ERROR, err);
  }
};

module.exports.getById = async (req, res) => {
  try {
    const { id } = { ...req.params };

    let user = await User.findOne({ _id: id })
      .populate("convs")
      .populate("grs")
      .exec();

    if (user) return HttpResponse(res, HttpStatus.OK, user);

    return HttpResponse(res, HttpStatus.NO_CONTENT);
  } catch (err) {
    return HttpResponseError(res, HttpStatus.INTERNAL_SERVER_ERROR, err);
  }
};

module.exports.getByEmail = async (req, res) => {
  try {
    const { email } = { ...req.params };

    let user = await User.findOne({ email })
      .populate("convs")
      .populate("grs")
      .exec();

    if (user) return HttpResponse(res, HttpStatus.OK, user);

    return HttpResponse(res, HttpStatus.NO_CONTENT);
  } catch (err) {
    return HttpResponseError(res, HttpStatus.INTERNAL_SERVER_ERROR, err);
  }
};

module.exports.getCurrent = async (req, res) => {
  const token = await (req.session.token || req.signedCookies.token);

  if (token) {
    //verify token
    jwt.verify(token, _CONF.TOKEN_SECRET, function (err, decoded) {
      if (err) return HttpResponse(res, HttpStatus.NO_CONTENT);

      return HttpResponse(res, HttpStatus.OK, decoded.user);
    });
  } else return HttpResponse(res, HttpStatus.NO_CONTENT);
};

module.exports.updateInfo = async (req, res) => {
  try {
    const { id } = req.params;

    const data = { ...req.body };

    let user = await User.findOneAndUpdate({ _id: id }, data, {
      new: true,
    }).exec();

    return HttpResponse(res, HttpStatus.CREATED, user);
  } catch (err) {
    return HttpResponseError(res, HttpStatus.INTERNAL_SERVER_ERROR, err);
  }
};

module.exports.updateAvatar = async (req, res) => {
  try {
    const { id } = req.params;

    const file = await req.source.toString("base64");

    const avatar_photo = new Buffer.from(file, "base64");

    const user = await User.findByIdAndUpdate(
      id,
      { avatar_photo },
      { new: true }
    ).exec();

    return HttpResponse(res, HttpStatus.CREATED, user);
  } catch (err) {
    return HttpResponseError(res, HttpStatus.INTERNAL_SERVER_ERROR, err);
  }
};

module.exports.updateCover = async (req, res) => {
  try {
    const { id } = req.params;

    const file = req.source.toString("base64");

    const cover_photo = new Buffer.from(file, "base64");

    const user = await User.findByIdAndUpdate(
      id,
      { cover_photo },
      { new: true }
    ).exec();

    return HttpResponse(res, HttpStatus.CREATED, user);
  } catch (err) {
    return HttpResponseError(res, HttpStatus.INTERNAL_SERVER_ERROR, err);
  }
};

module.exports.destroy = async (req, res) => {
  try {
    const { id } = req.params;

    let user = await User.delete({ _id: id }).exec();

    return HttpResponse(res, HttpStatus.OK, user);
  } catch (err) {
    return HttpResponseError(res, HttpStatus.INTERNAL_SERVER_ERROR, err);
  }
};

//TODO create join and leave conversation for user

module.exports.acceptFriend = async (req, res) => {};

module.exports.deleteFriend = async (req, res) => {};
