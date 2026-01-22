import { createClient } from '@/utils/supabase/server'

export default async function Page() {
    const supabase = await createClient()
    const { data: { session } } = await supabase.auth.getSession()

    return (
        <div className="p-10 font-sans">
            <h1 className="text-2xl font-bold mb-4">Supabase Connection Test</h1>
            <div className="space-y-2">
                <p><strong>URL:</strong> {process.env.NEXT_PUBLIC_SUPABASE_URL}</p>
                <p><strong>Connection Status:</strong> <span className="text-green-600">Client Initialized</span></p>
                <p><strong>Session:</strong> {session ? 'Active' : 'None (Expected)'}</p>
            </div>
        </div>
    )
}
