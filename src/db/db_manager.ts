import mongoose, { Mongoose } from 'mongoose';
import constants from '../common/constants';

interface DBConfig {
  url: string;
  db: string;
  debug: boolean;
}

export class DBManager {
  public static connection: Mongoose;

  public static async connect(config: DBConfig) {
    if (mongoose.connection.readyState == 0) {
      mongoose.set('debug', config.debug);
      const { url, db: dbName } = config;
      this.connection = await mongoose.connect(`${url}${dbName}`);

      const state = Number(mongoose.connection.readyState);
      // eslint-disable-next-line no-console
      console.log(`Database status -> ${constants.DB_STATES[state]}`);
    } else {
      return this.connection;
    }
  }

  public static debug(debug: any) {
    mongoose.set('debug', debug);
  }
}
