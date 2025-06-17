import { useState } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Separator } from '@/components/ui/separator.jsx'
import { Search, TrendingUp, TrendingDown, Youtube, Hash, Tag, FileText, Eye, Target } from 'lucide-react'
import './App.css'

function App() {
  const [tema, setTema] = useState('')
  const [loading, setLoading] = useState(false)
  const [resultados, setResultados] = useState(null)
  const [error, setError] = useState(null)

  const analisarTema = async () => {
    if (!tema.trim()) return
    
    setLoading(true)
    setError(null)
    
    try {
      const response = await fetch('https://youtube-seo-analyzer-backend-4.onrender.com/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ tema: tema.trim() })
      })
      
      if (!response.ok) {
        throw new Error('Erro ao analisar o tema')
      }
      
      const data = await response.json()
      setResultados(data)
    } catch (err) {
      setError('Erro ao conectar com o servidor. Verifique se o backend está rodando.')
      console.error('Erro:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-green-50 to-white">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-r from-blue-600 to-green-600 p-2 rounded-lg">
              <Youtube className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">YouTube SEO Analyzer</h1>
              <p className="text-gray-600">Ferramenta gratuita de análise de palavras-chave para YouTube</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Search Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Search className="h-5 w-5" />
              <span>Análise de Tema</span>
            </CardTitle>
            <CardDescription>
              Digite o tema do seu canal para obter análise completa de SEO e palavras-chave
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex space-x-4">
              <Input
                placeholder="Ex: Como fazer bolo de chocolate"
                value={tema}
                onChange={(e) => setTema(e.target.value)}
                className="flex-1"
                onKeyPress={(e) => e.key === 'Enter' && analisarTema()}
              />
              <Button 
                onClick={analisarTema}
                disabled={loading || !tema.trim()}
                className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700"
              >
                {loading ? 'Analisando...' : 'Analisar'}
              </Button>
            </div>
            {error && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-700">{error}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Results Section */}
        {resultados && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Analytics Cards */}
            <div className="lg:col-span-1 space-y-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center space-x-2">
                    <Eye className="h-5 w-5 text-blue-600" />
                    <span>Volume de Busca</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-blue-600">{resultados.volume_busca}</div>
                  <p className="text-sm text-gray-600 mt-1">buscas mensais</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center space-x-2">
                    {resultados.tendencia === 'alta' ? (
                      <TrendingUp className="h-5 w-5 text-green-600" />
                    ) : (
                      <TrendingDown className="h-5 w-5 text-red-600" />
                    )}
                    <span>Tendência</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Badge 
                    variant={resultados.tendencia === 'alta' ? 'default' : 'destructive'}
                    className={resultados.tendencia === 'alta' ? 'bg-green-600' : ''}
                  >
                    {resultados.tendencia === 'alta' ? 'Em Alta' : 'Em Baixa'}
                  </Badge>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center space-x-2">
                    <Target className="h-5 w-5 text-orange-600" />
                    <span>Concorrência</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Badge variant="outline" className="border-orange-600 text-orange-600">
                    {resultados.concorrencia.charAt(0).toUpperCase() + resultados.concorrencia.slice(1)}
                  </Badge>
                </CardContent>
              </Card>
            </div>

            {/* SEO Section */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <FileText className="h-5 w-5 text-green-600" />
                    <span>SEO Completo para Vídeo</span>
                  </CardTitle>
                  <CardDescription>
                    Otimização completa baseada na palavra-chave mestre
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Palavra Gancho */}
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Palavra Gancho para Thumbnail</h3>
                    <div className="bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2 rounded-lg font-bold text-center text-xl">
                      {resultados.seo.palavra_gancho}
                    </div>
                  </div>

                  <Separator />

                  {/* Palavra-chave Mestre */}
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Palavra-chave Mestre</h3>
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                      <p className="text-blue-900 font-medium">{resultados.seo.palavra_chave_mestre}</p>
                    </div>
                  </div>

                  <Separator />

                  {/* Descrição */}
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Descrição do Vídeo</h3>
                    <div className="bg-gray-50 p-4 rounded-lg border">
                      <p className="text-gray-900">{resultados.seo.descricao}</p>
                    </div>
                  </div>

                  <Separator />

                  {/* Hashtags */}
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2 flex items-center space-x-2">
                      <Hash className="h-4 w-4" />
                      <span>Hashtags</span>
                    </h3>
                    <div className="space-y-2">
                      <div>
                        <span className="text-sm text-gray-600">Hashtag Mestre:</span>
                        <Badge variant="outline" className="ml-2 border-green-600 text-green-600">
                          {resultados.seo.hashtag_mestre}
                        </Badge>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600">Hashtags Completas:</span>
                        <p className="text-blue-600 mt-1">{resultados.seo.hashtags}</p>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Tags */}
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2 flex items-center space-x-2">
                      <Tag className="h-4 w-4" />
                      <span>Tags</span>
                    </h3>
                    <div className="space-y-2">
                      <div>
                        <span className="text-sm text-gray-600">Tags Mestre:</span>
                        <p className="text-gray-900 mt-1 font-mono text-sm bg-gray-100 p-2 rounded">
                          {resultados.seo.tags_mestre}
                        </p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600">Tags Completas:</span>
                        <p className="text-gray-900 mt-1 font-mono text-sm bg-gray-100 p-2 rounded">
                          {resultados.seo.tags_completas}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Manual Section */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Manual de Uso</CardTitle>
            <CardDescription>Como utilizar a ferramenta para obter os melhores resultados</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-2">1. Digite o Tema</h3>
                <p className="text-gray-600 text-sm">
                  Insira o tema principal do seu canal ou vídeo. Seja específico para obter resultados mais precisos.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">2. Analise os Dados</h3>
                <p className="text-gray-600 text-sm">
                  Verifique o volume de busca, tendência e concorrência para validar se o tema é viável.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">3. Use o SEO Gerado</h3>
                <p className="text-gray-600 text-sm">
                  Copie e cole o SEO completo nos seus vídeos: título, descrição, hashtags e tags.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">4. Otimize Continuamente</h3>
                <p className="text-gray-600 text-sm">
                  Use a ferramenta regularmente para manter seus vídeos sempre otimizados e atualizados.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-12">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="text-center text-gray-600">
            <p>© 2025 YouTube SEO Analyzer - Ferramenta 100% Gratuita</p>
            <p className="text-sm mt-1">Desenvolvido com dados do Google Trends, YouTube Search e ferramentas de análise de keywords</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App

