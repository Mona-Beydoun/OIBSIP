const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const Admin = require('./models/Admin');

dotenv.config();

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    const adminEmail = 'monabeydoun.me@gmail.com';
    const adminPassword = 'Admin123456';
    const adminName = 'Mona Beydoun';

    await Admin.deleteMany({ email: adminEmail }); // clear any partial/failed previous attempt

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(adminPassword, salt);

    const admin = await Admin.create({
      name: adminName,
      email: adminEmail,
      password: hashedPassword,
    });

    console.log('✅ Admin created successfully:');
    console.log('Email:', admin.email);
    console.log('Password:', adminPassword);
    process.exit();
  } catch (error) {
    console.error('❌ Error creating admin:', error.message);
    process.exit(1);
  }
};

createAdmin();