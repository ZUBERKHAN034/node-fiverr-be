import constants from '../common/constants';
import { RespError } from './wr_response';

export async function handleError<T extends Error>(error: T): Promise<RespError> {
  if (error instanceof RespError) return new RespError(error.code, error.message);
  else return new RespError(constants.RESP_ERR_CODES.ERR_500, error.message);
}
