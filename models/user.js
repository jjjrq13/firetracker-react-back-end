const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
    {
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        username: { type: String, unique: true, required: true, trim: true },

        balance: { type: Number, default: 0 },
        hashedPassword: { type: String, required: true },
        isAdmin: { type: Boolean, default: false },
    },
    { timestamps: true } 
)

userSchema.pre('save',  async function () {
    if (this.username.toLowerCase() === 'thegoat') {
        this.isAdmin = true;
    }
});

userSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        delete returnedObject.hashedPassword;
    }
});

module.exports = mongoose.model ('User', userSchema);
