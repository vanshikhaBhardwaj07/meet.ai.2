import {Polar} from "@polar-sh/sdk";
import { ResourceNotFound } from "@polar-sh/sdk/models/errors/resourcenotfound.js";

export const polarClient = new Polar({
    accessToken: process.env.POLAR_ACCESS_TOKEN,
    server: "sandbox",
})

/**
 * A user has no Polar customer until their first checkout, and Polar answers
 * getStateExternal with a 404 until then. That is the normal state for a
 * free-tier account, so map it to null instead of letting it surface as a 500.
 * Anything else is rethrown so genuine Polar failures stay visible.
 */
export const getCustomerState = async (userId: string) => {
    try {
        return await polarClient.customers.getStateExternal({
            externalId: userId,
        });
    } catch (err) {
        if (err instanceof ResourceNotFound) {
            return null;
        }
        throw err;
    }
};
