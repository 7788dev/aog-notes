import { loadCategories, loadAllNotes } from '@/lib/notes'
import HomeClient from '@/components/HomeClient'
import siteConfig from '../../site.config'

// 构建时预加载数据
export default async function Home() {
  const categories = loadCategories()
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const notes = loadAllNotes().map(({ _file, _folder, ...rest }) => rest)
  
  const version = siteConfig.version

  return <HomeClient initialCategories={categories} initialNotes={notes} version={version} config={siteConfig} />
}
