# express-api-jwt-auth
An express framework helper tool to create quick api jwt authentication system.

## Install

```shell
sudo npm install -g express-api-jwt-auth
```
## Usage
After install, you can type ```express-auth``` command in the console the view the help page.

You can choose to generate a basic or full jwt auth code, by specifying the type as an argument for the command.

### Example

```shell
express-auth --type full
```

### Difference between the basic and full type

In the basic mode, not all stuffs are generated, the express-api-jwt-auth tool generate only these files:
- routes/api.js
- modules/utility.js
- modules/consts.js

Instead the full type generate theses files:

- routes/api.js
- modules/utility.js
- modules/consts.js
- models/user.js
- .env

> **Note** : For most cases the full type is preffered as it generate all needed files and configurations to just get started quickly. You just need to launch your server and everything will just work like a charm. 
