import { WALLET_IWF } from "$env/static/private";
import { PUBLIC_WALLET_ADDRESS } from "$env/static/public";
import chalk from "chalk";
import { mnee } from ".";

export async function checkFundBalance() {
	return mnee.balance(PUBLIC_WALLET_ADDRESS);
}

export async function rewardTaskCompleted(address: string, amount: number) {
	const balance = await mnee.balance(PUBLIC_WALLET_ADDRESS);
	if (balance.decimalAmount < amount) {
		const errorMsg = `not enough balance to send $${amount} of MNEE coin to ${address}.`;
		console.log(chalk.bgRed.bold(" ERROR "), errorMsg);
		throw new Error(errorMsg);
	}
	const transfer = await mnee.transfer([{ address, amount }], WALLET_IWF);
	console.log(chalk.bgGreen.bold(" TRANSFER "), `sending $${amount} of MNEE coin to ${address}.`);
}
