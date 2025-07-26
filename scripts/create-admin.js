const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://ntnghiadev:yd0Dn3N3JWwmkL6Q@wedding.ucfg2cd.mongodb.net/?retryWrites=true&w=majority&appName=wedding';

// User schema
const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
    },
    role: {
        type: String,
        enum: ['admin', 'user'],
        default: 'user',
    },
    name: {
        type: String,
        required: true,
        trim: true,
    },
}, {
    timestamps: true,
});

const User = mongoose.models.User || mongoose.model('User', userSchema);

// Hash password function
async function hashPassword(password) {
    return bcrypt.hash(password, 12);
}

async function createAdminUser() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(MONGODB_URI);

        // Check if admin user already exists
        const existingAdmin = await User.findOne({ email: 'admin@wedding.vn' });
        if (existingAdmin) {
            console.log('Admin user already exists!');
            console.log('Email:', existingAdmin.email);
            console.log('Role:', existingAdmin.role);
            return;
        }

        // Create admin user
        const hashedPassword = await hashPassword('admin123456');

        const adminUser = new User({
            email: 'admin@wedding.vn',
            password: hashedPassword,
            name: 'Wedding Admin',
            role: 'admin',
        });

        await adminUser.save();

        console.log('✅ Admin user created successfully!');
        console.log('📧 Email: admin@wedding.vn');
        console.log('🔑 Password: admin123456');
        console.log('👤 Role: admin');
        console.log('');
        console.log('Please change the password after first login!');

    } catch (error) {
        console.error('❌ Error creating admin user:', error);
    } finally {
        await mongoose.disconnect();
        process.exit(0);
    }
}

createAdminUser();
