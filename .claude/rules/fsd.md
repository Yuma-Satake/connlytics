# Feature-Sliced Design (FSD)

## App Layer

- `app`ディレクトリにはページネーション（ルーティング、レイアウト、プロバイダー設定など）以上のロジックを配置しないこと
- ビジネスロジック、UIコンポーネント、ユーティリティ関数などは適切なレイヤー（features, entities, shared など）に配置すること
