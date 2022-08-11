---
title: "Gitリモートブランチをローカルに対して同期する"
date: "2022-08-11"
---

Github で削除済みのリモートブランチ、自分のローカルで残ったままのが嫌なので、たまに消したくなるのだが、毎回わからなくなってしまうのでメモ

```bash
git remote prune origin
```

以上

## 参考

[Git - git-remote Documentation](https://git-scm.com/docs/git-remote#Documentation/git-remote.txt-empruneem)
