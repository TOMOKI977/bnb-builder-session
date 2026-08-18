# Cómo desplegar la feria (BSC testnet)

Orden: **puestos especialistas primero**, conserje al final (necesita las URLs).

Cada puesto:

```
1. Pegá 00-carcasa.md + el PROMPT.md del puesto en Cursor / Claude Code
2. El agente corre bag init (nombre del PROMPT, bsc-testnet, precio 0, Pieverse auto/free, wallet tirable, destination platform)
3. bag dev  →  un quote firmado
4. En TU terminal (nunca en el chat): WALLET_PASSWORD en .studio/.env.local
   Eso NO es una frase semilla. Es un password que inventás vos para cifrar
   el archivo de la llave. bag wallet new genera la llave. Ver abajo.
5. bag platform login   ← GitHub device code, una vez
6. bag deploy --provider bnb
7. bag deploy verify --provider bnb
8. bag erc8004 show     ← copiá agent_id + URL a feria.json
```

Trial BNB: 48 h, testnet, sin AWS. El runtime se cae; el DNI queda.

`feria.json` (lo lee el conserje):

```json
{
  "portero":   { "url": "https://…", "agent_id": "…" },
  "critico":   { "url": "https://…", "agent_id": "…" },
  "cajero":    { "url": "https://…", "agent_id": "…" },
  "escribano": { "url": "https://…", "agent_id": "…" }
}
```

## Password ≠ frase semilla

| | Qué es | Ejemplo |
|---|---|---|
| **Frase semilla** (12 o 24 palabras) | La llave misma. Quien las tiene, tiene la plata. Trust Wallet / MetaMask te las muestran **una vez**. | `cactus … river …` |
| **`WALLET_PASSWORD`** | Un password que **vos elegís**. Cifra el archivo de la llave (`.studio/wallets/`). Sin él el archivo no se abre; **no** es la semilla. | `TallerCbba2026!` (inventá el tuyo) |

Esta noche usamos wallet **evm-local** (la default de `bag`). El flujo es:

1. Inventás un password (mayúscula + minúscula + número alcanza).
2. Lo ponés vos, en tu máquina, en `.studio/.env.local` como `WALLET_PASSWORD=…`. Nunca en el chat, nunca en WhatsApp, nunca se lo dictés a Cursor.
3. `bag wallet new` **genera** una llave nueva y la guarda cifrada con ese password.

No copies las 12 palabras de tu Trust Wallet. Esta wallet es de **testnet y para tirar**. Si alguien te pide la semilla “para el taller”, es una estafa.

No subas `.studio/`, wallets ni `.env` al git. Este repo versiona **instructivos**, no las llaves.
