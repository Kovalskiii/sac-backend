export const listRoles = [
  'admin',
  'new',
];

const roles = {

  admin: [
    'user.admin',
    'admin.worker.all',
    'admin.statistics.all'
  ],

  new: [
    'user.new'
  ],

};
export default roles;
