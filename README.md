# Web3 Bounty

### Prerequisite:
- [Node v24](https://nodejs.org/en) or newer
- [Bun v1.35](https://bun.sh/) or newer (might be optional but this repo developed primarily on Bun)

**Demo url:** [https://web3-bounty.prognovel.workers.dev/](https://web3-bounty.prognovel.workers.dev/)

## What is this?

Web3 Bounty is freelancer platform but with Web3 ethereum-based tokens and smart contracts with Solidity. It's created mainly for MNEE hackaton.

## What it does

It is a simplified version of traditional freelancing platform (for now) but with smart contract. Client can post a work (labeled as "bounty") and freelancer can post a bid on those bounties. Both client and freelancers will sign up with Web3 wallets like Metamask.

## How to setup

Check `.env.example` for environment variable needed to setup. For testing purpose, ENV needed to configure mainly S3 env for storage (for uploading bid attachments) and `JWT_SECRET` for auth. For JWT secret you can generate it with something like `openssl rand -base64 32`.

Once ENV variables done, you need to setup database tables. Web3 Bounty uses SQLite as its database. By default, this repo uses Nodejs `better-sqlite3` as its DB, which is very convenient in dev environment. Alternatively, you can use different SQLite with Drizzle ([for more information](https://orm.drizzle.team/docs/get-started-sqlite)) by changing database client in `src/lib/server/db/index.ts` and in `drizzle.config.ts`.

Create a fresh database with tables from Drizzle's schemas with `bunx drizzle-kit push`. Browse database with `bunx drizzle-kit studio` to ensure the database schema is ready and set. To run dev server simply use `bun run dev`.

In the dev environment, smart contract will use Sepolia and WETH as ERC20 Token for testing purpose. In production this will be switched with various ERC20 tokens including MNEE Stablecoin. MNEE token implementation is hardcoded in the app so there should be no or minimal stuff needed to configure to get them done.

## About smart contract

Smart contract used in Web3 Bounty written in Solidity, but the Solidity build setup not included in this repo because for some reason Hardhat that I use has `zod` dependency conflict with the rest of the code. However the `.sol` files available in `contracts/` folder.

You must deploy `escrow-EIP712.sol` contract first before you deploy the `escrow-factory.sol`. The address in the first contract will be used as the parameter for deploying the factory contract. Both files require [OpenZeppelin](https://www.openzeppelin.com/solidity-contracts/) installed as library.

To deploy `escrow-EIP712.sol`, you need to fill these parameters:
```
feeBps = 500          # 500 -> 5% fee cut. 10_000 -> 100% and so on.
feeAddr = 0xabc123    # Wallet address for the platform to receive
                      # platform fee cut
```

Once you get the smart contract address from the Solidity file you just deployed, proceed to deploy factory contract `escrow-factory.sol`:
```
escrowImplementation = 0xabc123   # the address of previous smart contract
```

`escrow-EIP712.sol` contains business logic needed for Web3 freelance platform to operate. The app make a contract call against `escrow-factory.sol`, which will clone `escrow-EIP712.sol` for every bounties created.

Once both of the Solidity files ready, you can go to `src/lib/_eth-shared.ts` file and set
```typescript
export const factoryContractAddress: Hex = dev
	? "0x81e23606717dcc353e673412a9c0f79a066dbf8d" // Sepolia network
	: "0x8bd5c06f1aa76e86186852f8df20fa7db9ac4738"; // Mainnet network
```

Alternatively, you can skip deploying smart contract and use smart contracts that I deployed without making change to the file. (While the smart contract is live, I haven't yet verify and publish the .sol files so the smart contract might be tagged as scam in Ethereum mainnet)

## Caveats and limitations

I joined the MNEE hackaton midway and only have 3 weeks to make this from scratch, so the prototype is a bit rough. Some features are not quite ready yet like leaderboard, transaction trackers, bounties/bids browsers and filters, etc. It'd be nice if I could have the opportunity to work this more but the submission day approaching so I decided to leave them out for now.

There are several bugs in the app right now though most of them not critical. The failsafe error handling for ethereum transactions not quite mature yet so in some cases some bounties might get stuck if something error in the backend, so it's not quite ready for production yet.

Particularly, I'm making Web3 Wallet based user sign up using JWT from scratch. The implementation currently quite naive so user need to connect/disconnect account manually in the wallet if need to switch accounty. Also, multiple wallet currently not supported - disabled other Web3 Wallet extensions to avoid the dumb auth system from getting confused. I should just learn to use legit Web3 auth library from somewhere if this project is getting into production for real.

## Third-party API and SDK

This repo uses AWS S3 SDK to access S3-like storage to store upload attachments (the demo uses R2 Storage instead of S3). And the demo version live on Cloudflare Workers uses Turso with Drizzle API. The API and SDK used in this repo should be free and open to public unless otherwise needing to access for paid products.

## And by the way...

This project is licensed in MIT. 
