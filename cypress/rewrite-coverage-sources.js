#!/usr/bin/env node
const fastGlob = require("fast-glob")
const { join, resolve, sep } = require("path")

const rootDir = resolve(join(__dirname, "..")) + sep

function rewritePath(path) {
  path = path.replace(rootDir, "")

  path = path.replace(join(".blitz", "dev") + sep, "")
  path = path.replace(join(".blitz", "build") + sep, "")

  if (path.startsWith(join("app", "_resolvers"))) {
    path = path.replace("_resolvers" + sep, "")
  } else if (path.includes("mutations") || path.includes("queries")) {
    return null
  }

  if (path.startsWith("pages")) {
    const pathName = path.replace("pages", "")
    const [file] = fastGlob.sync("**" + pathName, { cwd: join(__dirname, "..", "app") })
    path = join("app", file)
  }

  if (path.startsWith("api/")) {
    path = join("app", path)
  }

  return rootDir + path
}

function isEmpty(obj) {
  return Object.keys(obj).length === 0
}

function rewrite(json) {
  const newOutJson = {}

  for (const [key, value] of Object.entries(json)) {
    const newPath = rewritePath(key)

    if (!newPath) {
      continue
    }

    if (isEmpty(value.branchMap) && !isEmpty(value.b)) {
      continue
    }

    newOutJson[newPath] = {
      ...value,
      path: newPath,
    }
  }

  return newOutJson
}

let input = ""
process.stdin.on("data", (data) => (input += data.toString("utf-8")))
process.stdin.on("end", () => {
  const outJson = JSON.parse(input)

  const newOutJson = rewrite(outJson)

  process.stdout.write(JSON.stringify(newOutJson, null, 2))
})
