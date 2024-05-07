const permissionRef = Object.freeze({
  all: [
    "admin",
    "worship-pastor",
    "worship-leader",
    "worship-team-member",
    "media-team",
    "sound-team",
    "guest",
  ],
  admin: ["admin"],
  "worship-pastor": ["admin", "worship-pastor"],
  "worship-leader": ["admin", "worship-pastor", "worship-leader"],
  "worship-team-member": [
    "admin",
    "worship-pastor",
    "worship-leader",
    "worship-team-member",
  ],
  "media-team": [
    "admin",
    "worship-pastor",
    "worship-leader",
    "worship-team-member",
    "media-team",
  ],
  "sound-team": [
    "admin",
    "worship-pastor",
    "worship-leader",
    "worship-team-member",
    "media-team",
    "sound-team",
  ],
  guest: [
    "admin",
    "worship-pastor",
    "worship-leader",
    "worship-team-member",
    "media-team",
    "sound-team",
    "guest",
  ],
});

const roles = Object.freeze([
  "admin",
  "worship-pastor",
  "worship-leader",
  "worship-team-member",
  "media-team",
  "sound-team",
  "guest",
]);

const defaultRole = Object.freeze("guest");

module.exports = {
  permissionRef,
  roles,
  defaultRole,
};
