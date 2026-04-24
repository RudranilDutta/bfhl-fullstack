const express = require('express')
const cors = require('cors')

const app = express()
app.use(cors())
app.use(express.json())

const USER_ID = 'RudranilDutta_18062005'
const EMAIL_ID = 'rd1342@srmist.edu.in'
const ROLL = 'RA2311003012264'

const VALID = /^([A-Z])->([A-Z])$/

function analyze(input) {
  const bad = []
  const dup = []
  const seen = new Set()
  const edges = []

  for (let x of input) {
    const s = String(x).trim()
    const m = s.match(VALID)

    if (!m || m[1] === m[2]) {
      bad.push(x)
      continue
    }

    if (seen.has(s)) {
      if (!dup.includes(s)) dup.push(s)
      continue
    }

    seen.add(s)
    edges.push([m[1], m[2]])
  }

  const graph = new Map()
  const parent = new Map()
  const nodes = new Set()

  for (let [a, b] of edges) {
    nodes.add(a)
    nodes.add(b)

    if (parent.has(b)) continue

    parent.set(b, a)

    if (!graph.has(a)) graph.set(a, [])
    graph.get(a).push(b)
  }

  function detectCycle(start, stack = new Set()) {
    if (stack.has(start)) return true
    stack.add(start)

    for (let nxt of (graph.get(start) || [])) {
      if (detectCycle(nxt, new Set(stack))) return true
    }
    return false
  }

  function build(node) {
    const obj = {}
    for (let c of (graph.get(node) || [])) {
      obj[c] = build(c)
    }
    return obj
  }

  function depth(node) {
    const kids = graph.get(node) || []
    if (kids.length === 0) return 1
    return 1 + Math.max(...kids.map(depth))
  }

  const visited = new Set()
  const result = []

  for (let node of nodes) {
    if (visited.has(node)) continue

    const comp = new Set()
    const stack = [node]

    while (stack.length) {
      let cur = stack.pop()
      if (comp.has(cur)) continue
      comp.add(cur)

      for (let c of (graph.get(cur) || [])) stack.push(c)
      if (parent.has(cur)) stack.push(parent.get(cur))
    }

    comp.forEach(n => visited.add(n))

    const isCycle = [...comp].some(n => detectCycle(n))

    let roots = [...comp].filter(n => !parent.has(n) || !comp.has(parent.get(n)))
    let root = roots.length ? roots.sort()[0] : [...comp].sort()[0]

    if (isCycle) {
      result.push({ root, tree: {}, has_cycle: true })
    } else {
      result.push({
        root,
        tree: { [root]: build(root) },
        depth: depth(root)
      })
    }
  }

  result.sort((a, b) => {
    if (!!a.has_cycle !== !!b.has_cycle) return a.has_cycle ? 1 : -1
    return a.root.localeCompare(b.root)
  })

  const trees = result.filter(r => !r.has_cycle)
  const cycles = result.filter(r => r.has_cycle)

  let largest = ''
  if (trees.length) {
    trees.sort((a, b) => b.depth - a.depth || a.root.localeCompare(b.root))
    largest = trees[0].root
  }

  return {
    user_id: USER_ID,
    email_id: EMAIL_ID,
    college_roll_number: ROLL,
    hierarchies: result,
    invalid_entries: bad,
    duplicate_edges: dup,
    summary: {
      total_trees: trees.length,
      total_cycles: cycles.length,
      largest_tree_root: largest
    }
  }
}

app.post('/bfhl', (req, res) => {
  if (!Array.isArray(req.body.data)) {
    return res.status(400).json({ error: 'data must be array' })
  }
  res.json(analyze(req.body.data))
})

app.listen(3000, () => console.log('Running on 3000'))