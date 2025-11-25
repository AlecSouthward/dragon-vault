# Dragon Vault (WIP)

**Dragon Vault** is an open-source self-hosted website; created
specifically for managing/playing Dungeons & Dragons campaigns remotely
(through voice calls preferably).

## Features

- Invite-only and designed to be self-hosted (though a public version may be released _if there is demand_)
- Allows users to create and manage their own Campaign
- Campaigns allow for custom Characters (custom types of resource pools, items, skills, etc.)
- Manages DND Sessions easily by allowing for easy dice rolls and viewing of a character's information (and items, etc.)
- Allows the DM (Dungeon Master), during a session, to enable a whiteboard that displays details easily in combat

## Getting Started

### Prerequisites

- Node.js `>=24`
- PostgreSQL `>=18`

### Installation

```bash
git clone https://github.com/AlecSouthward/dragon-vault.git
cd dragon-vault

npm install
```

Make sure you have a PostgreSQL instance and a Dragon Vault database on it.
If you do, then run `npm run pg:migrate up` while in the backend directory to build up your database (development only).

### Running

This can be used for either the Frontend or Backend:

```bash
npm run dev
```

**Please note**: The Frontend _requires_ a `.env` file in it's directory, while (for development) the Backend requires a `.env.development` file in it's directory.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.
Please also read the [Code of Conduct](CODE_OF_CONDUCT.md).

## License

This project is licensed under the GNU License – see [LICENSE](LICENSE) for details.

## Contact

If you need help or want to report an issue, open a GitHub issue or email me at [alecsouthward@gmail.com](mailto:alecsouthward@gmail.com).
