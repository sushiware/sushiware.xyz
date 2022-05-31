---
title: "PinataにNFTのmetadataをpinする"
date: "2022-05-31"
---

NFT の生成のために、pinata を使って metadata を pin したい。

## やりたいこと

1. 任意の directory 以下の NFT の画像を pin する
2. `ipfs://{CID}/images/1.png`を json に埋め込む
3. 任意の directory 以下に json ファイルを保存
4. json を `ipfs://{CID}/metadata/1.json`という形で pin する

という流れで metadata を pin したい。

## Pinata API

まず、API キーを生成する必要がある。

アカウントマークを押したら API Key のマークがあるのでそこから生成。

Admin で作成する。

## スクリプト

Go で作成

コード全体はこちら[sushiware/pinata-example](https://github.com/sushiware/pinata-example)

### Healthcheck

接続を確認するためのメソッド

```go
func (s *PinataClient) Healthcheck() error {
	const path = "data/testAuthentication"

	req, err := http.NewRequest(
		http.MethodGet,
		pinataURL+path,
		nil,
	)

	if err != nil {
		return err
	}

	req.Header.Set("PINATA_API_KEY", s.apiKey)
	req.Header.Set("PINATA_SECRET_API_KEY", s.secretAPIKey)

	res, err := s.httpClient.Do(req)
	if err != nil {
		return err
	}

	result := &HealthcheckResult{}

	if err := json.NewDecoder(res.Body).Decode(result); err != nil {
		return err
	}

	return nil
}
```

### Pin Directory

`ipfs://{CID}/images/1.png`のようにアクセスしたいので

ディレクトリを pin する前提で実装。

```go
func (c *PinataClient) PinDir(contents [][]byte, names []string, dir string, metadata *PinataMetadata) (*PinResult, error) {
	const path = "pinning/pinFileToIPFS"

	body := bytes.NewBuffer(nil)
	writer := multipart.NewWriter(body)

	for i, content := range contents {
		if err := c.writeFile(writer, filepath.Join(dir, names[i]), content); err != nil {
			return nil, err
		}
	}

	if err := c.writeMetadataPart(writer, metadata); err != nil {
		return nil, err
	}

	if err := c.writeOptionsPart(writer); err != nil {
		return nil, err
	}

	if err := writer.Close(); err != nil {
		return nil, err
	}

	req, err := http.NewRequest(
		http.MethodPost,
		pinataURL+path,
		body,
	)

	if err != nil {
		return nil, err
	}

	req.Header.Set("Content-Type", writer.FormDataContentType())
	req.Header.Set("PINATA_API_KEY", c.apiKey)
	req.Header.Set("PINATA_SECRET_API_KEY", c.secretAPIKey)

	res, err := c.httpClient.Do(req)
	if err != nil {
		return nil, err
	}

	result := &PinResult{}

	if err := json.NewDecoder(res.Body).Decode(result); err != nil {
		return nil, err
	}

	return result, nil
}
```

大したことはやっていないが、

あんまり、ipfs 関連のコードが NFT プロジェクトの Github に置かれていないので、まとめてみた。

というより、そもそも NFT プロジェクトは圧倒的に Github にコードが置かれていない。ひどい。
