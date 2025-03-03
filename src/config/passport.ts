// import passport from "passport";
// import { Strategy as LocalStrategy } from "passport-local";
// import bcrypt from "bcrypt";
// import dataSource from "ormconfig";
// import { User } from "~/packages/database/models/User";
 

// passport.use(
//   new LocalStrategy({ usernameField: "email" }, async (email, password, done) => {
//     try {
//       const userRepo = dataSource.getRepository(User);
//       const user = await userRepo.findOneBy({ email });

//       if (!user) return done(null, false, { message: "User not found" });

//       const isMatch = await bcrypt.compare(password, user.passwordHash);
//       if (!isMatch) return done(null, false, { message: "Incorrect password" });

//       return done(null, user);
//     } catch (error) {
//       return done(error);
//     }
//   })
// );

// passport.serializeUser((user: any, done) => {
//   done(null, user.id);
// });

// passport.deserializeUser(async (id: string, done) => {
//   const userRepo = dataSource.getRepository(User);
//   const user = await userRepo.findOneBy({ id });
//   done(null, user);
// });

// const authPassport=passport
// export default authPassport;
