# Visits

## reset

```sql
SELECT @visits_count := count(ip), @visits_total := sum(view) FROM visits;
TRUNCATE visits;
INSERT INTO visits (ip,view) VALUES (0,@visits_total);
```
