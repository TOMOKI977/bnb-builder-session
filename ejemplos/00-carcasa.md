# Carcasa — no la reescribas

Pegá esto **arriba** de cada `PROMPT.md`. Es el puesto de la feria, no un chatbot.

```
Trabajás con BNB Agent Studio v2 (bag), TypeScript, red bsc-testnet.

INVARIANTES (no los toques):
- Precio ERC-8183: 0 U esta noche (gratis para testear). Si pido 0.1 U, es para que se vea el cobro.
- Pieverse auto/free. Wallet evm-local nueva, de usar y tirar. destination platform.
- El agente SOLO analiza, recomienda o intermedia. Nunca ejecuta swaps, transferencias ni liquidaciones.
- Signing queda en código fijo. No expongas firmar / pagar como tool del LLM.
- Respuestas en castellano.
- Este agente es UN puesto de "La Feria del Trato": oficios complementarios. No es un super-agente que lo hace todo.
- Al final: bag dev hasta un quote firmado, después bag deploy --provider bnb y bag deploy verify --provider bnb.

Si falta Node o bag, instalá:
npm i -g @bnbagent/studio-cli
bag skills install --scope user --target cursor
y recargá el editor. Recién ahí creás el agente.
```
