import { db } from '../db';
import { unitKerja } from '../db/schema/unit-kerja';
import { defineEventHandler } from 'h3';

interface OrgNode {
  id: number
  nama: string | null
  level: number | null
  parentId: number | null
  children: OrgNode[]
}

export default defineEventHandler(async () => {
  const rows = await db.select().from(unitKerja).orderBy(unitKerja.level, unitKerja.nama);

  const nodeMap = new Map<number, OrgNode>();

  for (const row of rows) {
    nodeMap.set(row.id, {
      id: row.id,
      nama: row.nama,
      level: row.level,
      parentId: row.parentId,
      children: [],
    });
  }

  const roots: OrgNode[] = [];

  for (const node of nodeMap.values()) {
    if (node.parentId && nodeMap.has(node.parentId) && node.parentId !== node.id) {
      nodeMap.get(node.parentId)!.children.push(node);
    } else {
      roots.push(node);
    }
  }

  return roots;
});
