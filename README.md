## Miljøvariabler

Legg til følgende i `.env.local`:

```
SUPABASE_URL=<supabase prosjekt-url>
SUPABASE_SERVICE_ROLE_KEY=<service role key>
```

## Dataflyt og avmelding

- Interesseskjemaet lagrer navn (valgfritt), e-post, interessevalg og abonnementsstatus i tabellen `email_subscriptions` i Supabase.
- Hver rad får et `unsubscribe_token` (UUID). Lenker til `/unsubscribe?token=<token>` bruker dette feltet.
- Ved avmelding settes `subscribed=false` og token roteres for å gjøre gamle lenker ugyldige. Ny registrering kan gjøres med samme e-post og setter `subscribed=true` igjen.
