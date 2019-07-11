const fs = require("fs");

const env_path = process.env.PWD + "/.env";

const update_setting = (config_name, config_value) => {
    try {
        const buffer = fs.readFileSync(env_path);
        const config_str_array = buffer.toString().split("\n");

        let config_re_str = "";
        config_str_array.forEach((config_str, index) => {
            if (config_str.includes(config_name + " =")) {
                config_str_array[index] = config_name + " = " + config_value;
            }
            config_re_str += config_str_array[index];
            if (index < config_str_array.length - 1) {
                config_re_str += "\n";
            }
        });

        fs.writeFileSync(env_path, config_re_str);

        return { success: true, message: "Updated" };
    } catch (err) {
        console.log("Sorry, couldn't read/write .env file");
    }
};

module.exports.update_setting = update_setting;
