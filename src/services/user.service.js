
// SERVICES ARE ANY FEATURES PROVIDED BY THE APP OR CONNECTING TO DB TO MODIFY THE DATA
const userDB = [
  {
    id: 1,
    name: "Alice Johnson",
    email: "alice.johnson@example.com",
    password: "Password123!",
    role: "admin",
    isActive: true
  },
  {
    id: 2,
    name: "Bob Smith",
    email: "bob.smith@example.com",
    password: "SecurePass456#",
    role: "user",
    isActive: true
  },
  {
    id: 3,
    name: "Charlie Brown",
    email: "charlie.brown@example.com",
    password: "MySecretPassword789$",
    role: "user",
    isActive: false
  },
  {
    id: 4,
    name: "Diana Prince",
    email: "diana.prince@example.com",
    password: "ThemysciraPass#1",
    role: "moderator",
    isActive: true
  },
  {
    id: 5,
    name: "Evan Wright",
    email: "evan.wright@example.com",
    password: "EvanPassword99!",
    role: "user",
    isActive: true
  },
  {
    id: 6,
    name: "Fiona Gallagher",
    email: "fiona.gallagher@example.com",
    password: "SouthSideRules2026",
    role: "user",
    isActive: true
  },
  {
    id: 7,
    name: "George Miller",
    email: "george.miller@example.com",
    password: "GeorgePass2026*",
    role: "user",
    isActive: false
  },
  {
    id: 8,
    name: "Hannah Abbott",
    email: "hannah.abbott@example.com",
    password: "HufflepuffPass1!",
    role: "user",
    isActive: true
  },
  {
    id: 9,
    name: "Ian Malcolm",
    email: "ian.malcolm@example.com",
    password: "LifeFindsAWay3D!",
    role: "moderator",
    isActive: true
  },
  {
    id: 10,
    name: "Julia Roberts",
    email: "julia.roberts@example.com",
    password: "PrettyWoman#10",
    role: "user",
    isActive: true
  }
];


export const UserService = {
    getUsers: () => {
        const users = userDB;
        return users;
    },
    findUserById: async(id) => {
        // const user = await fetch(`${process.env.DB_URL}/users/${id}`);
        // const finalUser = await user.json();
        // return finalUser;
        const user = userDB[id];
        return user;
    },
    addNewUser: async(user) => {
        const currentTime = Date.now().toString();
        userDB.push({id: currentTime, ...user});
        return user;
    },
    findUserByEmail: (email) => {
        const user = userDB.find(user => user.email === email);
        return user;
    }
}

