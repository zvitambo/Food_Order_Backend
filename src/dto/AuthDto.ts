import { VandorPayload } from './VandorDto';
import { CustomerPayload } from "./CustomerDto";

export type AuthPayload = VandorPayload | CustomerPayload;